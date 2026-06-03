import prisma from '../lib/prisma.js'

export async function createTask(req, res) {
  try {
    const { title, description, status, boardId } = req.body

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        boardId
      }
    })

    return res.status(201).json(task)

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao criar task'
    })
  }
}

export async function getTasks(req, res) {
  try {
    const { boardId } = req.params

    const tasks = await prisma.task.findMany({
      where: {
        boardId: Number(boardId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.json(tasks)

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao buscar tasks'
    })
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params
    const { title, description, status } = req.body

    const task = await prisma.task.update({
      where: {
        id: Number(id)
      },
      data: {
        title,
        description,
        status
      }
    })

    return res.json(task)

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao atualizar task'
    })
  }
}

export async function deleteTask(req, res) {
  try {
    const { id } = req.params

    await prisma.task.delete({
      where: {
        id: Number(id)
      }
    })

    return res.json({
      message: 'Task removida com sucesso'
    })

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao remover task'
    })
  }
}