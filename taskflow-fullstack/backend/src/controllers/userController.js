import prisma from '../lib/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function register(req, res) {
  try {
    const { name, email, password } = req.body

    const userExists = await prisma.user.findUnique({
      where: { email }
    })

    if (userExists) {
      return res.status(400).json({
        error: 'E-mail já cadastrado'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    const { password: _, ...userWithoutPassword } = user

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userWithoutPassword
    })

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao criar usuário'
    })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        error: 'E-mail ou senha inválidos'
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'E-mail ou senha inválidos'
      })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: userWithoutPassword
    })

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao realizar login'
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const updateData = { name, email };

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "A senha atual é obrigatória para definir uma nova senha." });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "A senha atual está incorreta." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    if (email !== user.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: "Este e-mail já está em uso por outra conta." });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: updateData
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      message: "Perfil atualizado com sucesso!",
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Erro no updateProfile:", error);
    return res.status(500).json({ error: "Erro interno ao atualizar o perfil." });
  }
};