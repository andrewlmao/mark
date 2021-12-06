import {useState, useRef, useEffect} from 'react';
import './App.css';
import Card from './components/Card';
import * as Icon from "react-feather";
import nextId from "react-id-generator";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const ref = useRef(null);

  const cards = [
  {
    id: "0",
    term: "",
    definition: ""
  },
  ]

  const [cardList, setCardList] = useState(cards);
  const [cardOrientation, setCardOrientation] = useState(true);
  const [front, setFront] = useState("Click a card to preview");
  const [back, setBack] = useState("Click a card to preview");

  useEffect(() => {
    console.log(cardList);
  });

const addCard = () => {
    setCardList([...cardList,{
      term:"",
      definition: "",
      id: nextId(),
    }]);

    setTimeout(function() {
      ref.current.focus();
      ref.current.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

    const toastId = useRef(null);

  const notify = (id) => toastId.current = toast.error(<div>Confirm? <button className="deletebutton" onClick={() => determineRemove(id)}>Delete</button></div>, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
}); 

  const dismiss = () =>  toast.dismiss(toastId.current);
  
  const removeCard = (id) => {
    notify(id);
  }

  const determineRemove = (id) => {
    dismiss();
      let newCard = cardList.filter((card) => {
      return card.id !== id;
    });
    setCardList(newCard);
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(cardList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCardList(items);
  }


  return (
    <div className="createdeck">
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      />
      <section className="cardlist">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul className="cards" {...provided.droppableProps} ref={provided.innerRef}>
                {cardList.map((card, index) => {
                  return (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(provided) => (
                        <li class="cardlistmark" ref={provided.innerRef} {...provided.draggableProps} >
                          <div className="inputarea">
                            <div className="cardheader">
                              <div className="counter">{index + 1}</div>
                              <div className="formatter">
                                <Icon.Trash2 id="trashicon" onClick={() => removeCard(card.id)}></Icon.Trash2>
                                <Icon.Droplet id="editicon"></Icon.Droplet>
                                <Icon.Image id="imageicon"></Icon.Image>
                                <div onClick={() => {
                                  console.log("clicked red");
                                }} className = "color" style={{"background-color":"red"}}></div>
                                <div onClick={() => {
                                  let cursorPosition = ref.current.selectionStart;
                                  let textBeforeCursorPosition = ref.current.value.substring(0, cursorPosition);
                                  let textToInsert =  "<span style=\"color:blue\"></span>";
                                  let textAfterCursorPosition = ref.current.value.substring(cursorPosition, ref.current.value.length)
                                  ref.current.value = textBeforeCursorPosition + textToInsert + textAfterCursorPosition;
                                  ref.current.focus();
                                  ref.current.selectionStart = ref.current.selectionEnd = cursorPosition + 25;
                                }} className = "color" style={{"background-color":"blue"}}></div>
                              </div>
                              <div {...provided.dragHandleProps}><Icon.Menu className="mover"></Icon.Menu></div>
                            </div>

            <textarea ref={ref} class="term" id={card.id} onKeyUp={(e) => {
              e.target.style.height = 'inherit';
              e.target.style.height = `${e.target.scrollHeight}px`; 
              card.term = e.target.value;
              

              console.log(card.term);
              setFront(card.term); 
            }} 
              onFocus={() => {
                setFront(card.term);
                setBack(card.definition);
                console.log("focused")
                setCardOrientation(false);
              }}
              onKeyDown={(e) => {
                if (e.key == 'Tab') {
                  e.preventDefault();
                  let start = e.target.selectionStart;       
                  var end = e.target.selectionEnd;
                  e.target.value = e.target.value.substring(0, start) +"\t" + e.target.value.substring(end);
                  e.target.selectionStart =
                  e.target.selectionEnd = start + 1;
                }
                // if (e.key =="\"")
              }
              }
       />
      <label htmlFor="term">TERM</label>
      <textarea class="definition" id={card.id} onKeyUp={(e) => {
                 e.target.style.height = 'inherit';
         e.target.style.height = `${e.target.scrollHeight}px`; 
        card.definition= e.target.value;
        setBack(card.definition);
              }} onFocus={() => {
        setCardOrientation(true);
        setFront(card.term);
        setBack(card.definition);
      }} onKeyDown={(e) => {
           if (e.key == 'Tab') {
       let start = e.target.selectionStart;
             e.preventDefault();
     var end = e.target.selectionEnd;
     e.target.value = e.target.value.substring(0, start) +
       "\t" + e.target.value.substring(end);
     e.target.selectionStart =
       e.target.selectionEnd = start + 1;
   }
      }} />
      <label htmlFor="definition">DEFINITION</label>

      </div>
                        </li>
                      )}
                      
                    </Draggable>
                  );
                })}
                <div style={{"color":"transparent"}}>{provided.placeholder}</div>
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <button class="addnewcard" onClick={addCard} onFocus={
        addCard
      }>
        Add Card
      </button>
      </section>
      <section className="renderarea" onKeyDown={(e) => {
        // if(e.key === "Space") {
        //     console.log("spacebared");
        // }
        }}>
        <Card front={front} back={back} cardOrientation = {cardOrientation}></Card>
    </section>
    </div>
  );
}

export default App;