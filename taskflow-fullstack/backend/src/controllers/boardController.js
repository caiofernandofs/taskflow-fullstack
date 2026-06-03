import prisma from '../lib/prisma.js'

export async function createBoard(req, res) {
  try {
    const { title } = req.body

    const board = await prisma.board.create({
      data: {
        title,
        userId: req.userId
      }
    })

    return res.status(201).json(board)

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao criar board'
    })
  }
}

export async function getBoards(req, res) {
  try {
    const boards = await prisma.board.findMany({
      where: {
        userId: req.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.json(boards)

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao buscar boards'
    })
  }
}

export async function updateBoard(req, res) {
  try {
    const { id } = req.params
    const { title } = req.body

    const board = await prisma.board.updateMany({
      where: {
        id: Number(id),
        userId: req.userId
      },
      data: {
        title
      }
    })

    return res.json({
      message: 'Board atualizado com sucesso',
      board
    })

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao atualizar board'
    })
  }
}

export async function deleteBoard(req, res) {
  try {
    const { id } = req.params

    await prisma.board.deleteMany({
      where: {
        id: Number(id),
        userId: req.userId
      }
    })

    return res.json({
      message: 'Board removido com sucesso'
    })

  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao remover board'
    })
  }
}
