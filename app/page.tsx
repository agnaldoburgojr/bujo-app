'use client';
import { Suspense, useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Icon } from './components/Icon';
import { format, set } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';

const today = new Date()
const formattedDate = format(new Date(), 'dd.MM.yyyy') + ' - ' + format(new Date(), 'EEE', {locale: ptBR}).substring(0, 3)
const apiDate = format(new Date(), 'yyyy-MM-dd')

export enum Status {
  TO_DO = 'TO_DO',
  DONE = 'DONE',
  TO_TOMORROW = 'TO_TOMORROW',
  CANCELED = 'CANCELED'
}

const getIconName = (status: Status) => {
  switch (status) {
    case Status.TO_DO:
      return 'task'
    case Status.DONE:
      return 'done'
    case Status.TO_TOMORROW:
      return 'next'
    case Status.CANCELED:
      return 'delete'
    default:
      return 'task'
  }
}
type Register ={
  id: string,
  description: string
  status: Status
}


async function getRegisters(date: string) {
  const res = await fetch(`http://localhost:3000/api/registers?date=${date}`)
  return res.json()
}

async function createRegister(date: string, description: string) {
  const res = await fetch(`http://localhost:3000/api/registers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({date, description})
  })
  return res.json()
}



async function updateRegister({id, description, status} : Register) {
  const res = await fetch(`http://localhost:3000/api/registers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({description, status, date: apiDate})
  })
  return res.json()
}

export default function Home() {
  const [lines, setLines] = useState<Register[]>([])
  const [showInput, setShowInput] = useState(false)
  const [task, setTask] = useState('')
  const [editable, setEditable] = useState('')
  const [contentEditable, setContentEditable] = useState('')
  const [seeOptions, setSeeOptions] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getRegisters(apiDate).then((registers) => {
      setLines(registers)
      setLoading(false)
    })
  }, [])

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey === true && event.key === 'n') {
      setShowInput(true)
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value)
  }
  
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      lines.push({
        id: uuidv4(),
        description: task,
        status: Status.TO_DO
      })
      setTask('')
      await createRegister(apiDate, task)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>, item: Register) => {
    if(e.detail === 2){
      setEditable(item.id)
      setContentEditable(item.description)
    }
  }

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentEditable(e.target.value)
  }

  const handleKeyDownEdit = async(e: React.KeyboardEvent<HTMLInputElement>, l: Register) => {
    if (e.key === 'Enter') {
      const position = lines.findIndex((l: Register) => l.id === editable)
      const newLines = lines
      newLines[position] = {
        ...l,
        id: editable,
        description: contentEditable,
        
      }
      setLines([...newLines])
      setContentEditable('')
      setEditable('')
      await updateRegister({...l, description: contentEditable})
    }
  }

  const handleStatus = async(register: Register, status: Status) => {
    const position = lines.findIndex((l: Register) => l.id === register.id)
    const newLines = lines
    newLines[position] = {
      ...register,
      status
    }
    setLines([...newLines])
    await updateRegister({...register, status})
  }


  return (
    <main className="container mx-auto">
     <div className='w-[32rem] mx-auto mt-16'>
      <nav className='flex justify-between items-center'>
        <Icon name="zap" isStatic/>
        <div className='flex gap-2'>
          <Icon name="plus" onClick={() => setShowInput(true)}/>
          <Icon name="settings" isStatic/>
        </div>
      </nav>
      <div className='mt-16'>
        <p className='font-semibold	text-xs mb-2 text-slate-500 uppercase'>{formattedDate}</p>
        {loading ? (
          <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
            <div className="w-full mt-4">
              <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-60 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-60 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-60 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-60 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-60 mb-4"></div>
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        ):(
        <div >
        { lines.map((l: Register) => (
          <div key={l.id}>
            {editable === l.id ? (
              <input
                className='w-full p-2 outline-black h-8'
                placeholder={l.description} 
                onChange={handleEdit}
                onKeyDown={(e) => handleKeyDownEdit(e, l)}
                onBlur={() => {
                  setEditable('')
                  setContentEditable('')
                }}
                value={contentEditable}
                autoFocus
              />
            ) : (
              <div 
                className='flex items-center -ml-[6rem]'
                onMouseEnter={()=> setSeeOptions(l.id)}
                onMouseLeave={()=> setSeeOptions('')}
              >
                {
                  seeOptions === l.id ? 
                  (
                    <div className='flex cursor-pointer w-[6rem]'>
                      <Icon name='task' onClick={()=> handleStatus(l, Status.TO_DO)}/>
                      <Icon name='done' onClick={()=> handleStatus(l, Status.DONE)}/>
                      <Icon name='next' onClick={()=> handleStatus(l, Status.TO_TOMORROW)}/>
                      <Icon name='delete' onClick={()=> handleStatus(l, Status.CANCELED)}/>
                    </div>
                  ): (
                    <div className='w-[6rem]'></div>
                  )
                }
                <div className='my-1 flex items-center relative'>
                  <Icon name={getIconName((l.status))} isStatic dark/>
                  <div>
                    <p className={`ml-2 ${(l.status) === Status.CANCELED && 'line-through decoration-2'}`} onClick={(e) => handleClick(e, l)} >
                      {l.description}
                    </p>
                    {(l.status) === Status.CANCELED && 
                      <div className='absolute top-0 left-4'>
                        <Icon name='delete' isStatic dark
                      />
                    </div>}
                  </div>
                </div>
                
              </div>
            )}
          </div>
        ))}
        { showInput && (
          <input 
            className='w-full p-2 outline-black mt-2 h-8'
            placeholder="nova tarefa" 
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setTask('')
              setShowInput(false)
            }}
            value={task}
            autoFocus
          />
        )}
        </div>
       )}
      </div>
     </div>
    </main>
  )
}

