import { NextResponse } from "next/server"
import  prisma  from "../../lib/prisma"
import { NextApiRequest } from "next"

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const date: string = searchParams.get('date') as string
  const registers = await prisma.register.findMany({
    where: {
      
      date: {
        
        gte: new Date(date)
      }
    },
    orderBy: {
      createdAt: 'asc'
    },
  })
  //const registers = await prisma.register.findMany()
  return NextResponse.json(registers)
}

export async function POST(
  req: Request,
) {
  const {description, date} = await req.json()
  try {
    await prisma.register.create({
      data: {
        date: new Date(date),
        description
      }
    })
    return NextResponse.json({message: `Created`}, {status: 201})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: `Not Created`}, {status: 400})
  }
}

