import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

export interface ISubmitResult {
  items:Array<{
    clientId: string,
    clientName:string,
    createTimestamp: string,
    plannedEndTime: string,
    plannedStartTime: string,
    taskId: string,
    taskTypeId: number,
    taskTypeName:string
  }>,
  stage:string,
  stageName: string
}

const App = () => {
  const [data, setData]  = useState<undefined | Array<ISubmitResult>>();
  const [selectedPerson, setSelectedPerson] = useState<any>();

  useEffect(() => {
    async function fetchData(){
      const data = await axios.get("https://kdwed-f1dd2-default-rtdb.europe-west1.firebasedatabase.app/tasks.json")
      setData(data.data)
    }
    fetchData()
  }, [])

  console.log(data)

  const dragStartHandler = ( e : any ,card : ISubmitResult, task : any) => {
    const id = task.clientId
    setSelectedPerson(task);
    setData(data?.map((item: any,index) => {
        item.items = item.items.filter((task: { clientId: any; }) => task.clientId !== id)
      return item;
    }))    
  }

  const dragEndHandler = (e : any) => {

  }

  const dragOverHandler = (e : any) => {
    e.preventDefault()
  }

  const dropHandler = (e : any, card : ISubmitResult, task : any ) => {
    e.preventDefault()
    console.log(task)
    const stage = card.stage
    setData(data?.map((item : any, index) => {
      if (item.stage === stage){
        item.items.unshift(selectedPerson)
      }
      return item;
    }))
  } 

  return (
    <div className='App'>
        <h1>Задачи Нурманова Бибижан</h1>
        <div className='tasks'>
            {
              data?.map(item => {
                return (
                  <div className='task'>
                    <div className='task__title'>
                      <span>{item.stageName}</span> <span className='counter'>{item.items.length}</span>  
                    </div>
                    <div className='task__items'>
                      {
                        item.items.map(task => (
                          <div className='task__item' draggable={true}
                            onDragStart={(e) => dragStartHandler(e, item, task)}
                            onDragLeave={(e) => dragEndHandler(e)}
                            onDragEnd={(e) => dragEndHandler(e)} 
                            onDragOver={(e) => dragOverHandler(e)}
                            onDrop={(e) => dropHandler(e,item, task)}  
                          >
                            <div className='task__item-info'>
                              <div className='task__item-info-date'>
                                {new Date(Date.parse(task.createTimestamp)).toString()}
                              </div>
                              <div className='task__item-info-name'>
                                {task.clientName}
                              </div>  
                            </div>
                            <div className='task__item-img'>
                              <img src="logo.png" alt=""  width={40}/>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )
              })
            }
            {/* <div className='task'>
              <div className='task__title'>
                 <span>Просроченные</span> <span>{data[0].items .length}</span>  
              </div>
            </div>
            <div className='task'>
              <div className='task__title'>
                <span>Задачи на сегодня</span> <span>{data[1].items.length}</span> 
              </div>
            </div>
            <div className='task'>
              <div className='task__title'>
                <span>Задачи на завтра</span> <span>{data[2].items.length}</span> 
              </div>
            </div> */}
        </div>
    </div>
  );
}

export default App;
