'use client';
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { Icon } from './components/Icon';

enum Status {
  'TODO',
  'DONE',
  'GOTO',
  'CANCELED'
}

const getIconName = (status: Status) => {
  switch (status) {
    case Status.TODO:
      return 'task'
    case Status.DONE:
      return 'done'
    case Status.GOTO:
      return 'next'
    case Status.CANCELED:
      return 'delete'
    default:
      return 'task'
  }
}
type Register ={
  id: string,
  content: string
  status: Status
}

export default function Home() {
  const [lines, setLines] = useState<Register[]>([])
  const [showInput, setShowInput] = useState(false)
  const [task, setTask] = useState('')
  const [editable, setEditable] = useState('')
  const [contentEditable, setContentEditable] = useState('')
  const [seeOptions, setSeeOptions] = useState('')

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
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      lines.push({
        id: uuidv4(),
        content: task,
        status: Status.TODO
      })
      setTask('')
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>, item: Register) => {
    if(e.detail === 2){
      setEditable(item.id)
      setContentEditable(item.content)
    }
  }

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentEditable(e.target.value)
  }

  const handleKeyDownEdit = (e: React.KeyboardEvent<HTMLInputElement>, l: Register) => {
    if (e.key === 'Enter') {
      const position = lines.findIndex((l: Register) => l.id === editable)
      const newLines = lines
      newLines[position] = {
        ...l,
        id: editable,
        content: contentEditable,
        
      }
      setLines([...newLines])
      setContentEditable('')
      setEditable('')
    }
  }

  const handleStatus = (register: Register, status: Status) => {
    const position = lines.findIndex((l: Register) => l.id === register.id)
    const newLines = lines
    newLines[position] = {
      ...register,
      status
    }
    setLines([...newLines])
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
        <p className='font-semibold	text-xs mb-2 text-slate-500'>12.06.2023 - TER</p>
        <div >
        { lines.map((l: Register) => (
          <div key={l.id}>
            {editable === l.id ? (
              <input
                className='w-full p-2 outline-black h-8'
                placeholder={l.content} 
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
                className='flex items-center -ml-20'
                onMouseEnter={()=> setSeeOptions(l.id)}
                onMouseLeave={()=> setSeeOptions('')}
              >
                {
                  seeOptions === l.id ? 
                  (
                    <div className='flex cursor-pointer w-20'>
                      <Icon name='done' onClick={()=> handleStatus(l, Status.DONE)}/>
                      <Icon name='next' onClick={()=> handleStatus(l, Status.GOTO)}/>
                      <Icon name='delete' onClick={()=> handleStatus(l, Status.CANCELED)}/>
                    </div>
                  ): (
                    <div className='w-20'></div>
                  )
                }
                <div className='my-1 flex items-center relative'>
                  <Icon name={getIconName(l.status)} isStatic dark/>
                  <div>
                    <p className={`ml-2 ${l.status === Status.CANCELED && 'line-through decoration-2'}`} onClick={(e) => handleClick(e, l)} >
                      {l.content}
                    </p>
                    {l.status === Status.CANCELED && 
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
      </div>
     </div>
    </main>
  )
}

