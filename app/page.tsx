'use client';
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

enum Status {
  'TODO',
  'DONE',
  'GOTO',
  'CANCELED'
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div >
        <button onClick={() => setShowInput(true)}>Adicionar tarefa</button>
        <br/><br/>
        <div>
        { lines.map((l: Register) => (
          <div key={l.id}>
            {editable === l.id ? (
              <input
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
                style={{display: 'flex', justifyContent: 'space-between', width: '400px'}}
                onMouseEnter={()=> setSeeOptions(l.id)}
                onMouseLeave={()=> setSeeOptions('')}
              >
                <p onClick={(e) => handleClick(e, l)} >
                  {l.status} - {l.content}
                </p>
                {
                  seeOptions === l.id && 
                  (
                    <div style={{display: 'flex', gap: '8px', cursor: 'pointer'}}>
                      <p onClick={()=> handleStatus(l, Status.DONE)}>X</p>
                      <p onClick={()=> handleStatus(l, Status.GOTO)}>{'>'}</p>
                      <p onClick={()=> handleStatus(l, Status.CANCELED)}>_</p>
                    </div>
                  )
                }
              </div>
            )}
          </div>
        ))}
        { showInput && (
          <input 
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
    </main>
  )
}
