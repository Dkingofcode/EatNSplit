import { useState } from 'react';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css';

const Friends = [
  {
    id: 329726,
    name: "Nathan",
    image: "./jackson-schaal-AR9mvykzSOA-unsplash.jpg",
    balance: 20
  },
  {
    id: 194507,
    name: "Dave",
    image: "./alexanderunsplash.jpg",
    balance: 22
  },
  {
    id: 330753,
    name: "Sarah",
    image: "./aiony-haust-3TLl_97HNJo-unsplash.jpg",
    balance: 0
  }
];


function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className='button'>
       {children}
    </button>
  )
}


function App() {
//  const [count, setCount] = useState(0)
  const [friends, setFriends] = useState(Friends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend){
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((current) => (current?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) => 
      friends.map((friend) => 
        friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend
      )
  )

  setSelectedFriend(null);
}




  return (
    <>
     <div  className='app'>
       <div className='sidebar'>
         <FriendList 
           friends={friends} 
           selectedFriend={selectedFriend} 
           onSelection={handleSelection} 
           />


         {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}  />} 
         
         <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
          
          </Button> 
       </div>
 
        {selectedFriend && (
            <FormSplitBill 
            selectedFriend={selectedFriend} 
            onhandleSplitBill={handleSplitBill} 
            key={selectedFriend.id}
            />
 
        )}
      
     </div>  
    </>
  )
}

function FriendList({ friends, onSelection, selectedFriend }) {
 // const newFriends = friends; 
  
  return (
     <ul>
      {friends.map((friend) => (  
         <Friend 
            friend={friend} 
            key={friend.id} 
            selectedFriend={selectedFriend}    
            onSelection={onSelection}>    
            </Friend>
      ))}
     </ul>
    );
}

function Friend({ friend, selectedFriend, onSelection }) {
   const isSelected = selectedFriend?.id === friend.id;
 
  return(
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>

        {friend.balance < 0 && (
           <p className='red'>
            You owe {friend.name} {Math.abs(friend.balance)}
           </p>
        ) 
      }

        {friend.balance > 0 && (
           <p className='green'>
             {friend.name} owes you {Math.abs(friend.balance)}
           </p>
        ) 
      }

      {friend.balance === 0 && (
           <p>
            You and {friend.name} are even.
           </p>
        ) 
      }

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select" }
      </Button>
      </li>
  );
}


function FormAddFriend({ onAddFriend}) {
  const [ name, setName ] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name, 
      image: `${image}?=${id}`, 
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage(" ")
  }

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
       <label> Friend name</label>
       <input 
          type='text' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />

       <label> Image URL</label>
       <input 
          type='text'   
          value={image}
          onChange={(e) => setImage(e.target.value)} 
          />

       <Button>Add</Button>
    </form>
  );
}


function FormSplitBill({ selectedFriend, onhandleSplitBill }) {
   const [bill, setBill] = useState("");
   const [paidByUser, setPaidByUser] = useState("");
   const paidByFriend = bill ? bill - paidByUser : "";
   const [whoIsPaying, setWhoIsPaying] = useState("user");


   function handleSubmit(e) {
     e.preventDefault();

    if(!bill || !paidByUser) return;
    onhandleSplitBill (whoIsPaying === "user" ? paidByFriend : -paidByUser);
   };



  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name} </h2>

      <label>Bill value</label>
      <input type='text' 
      value={bill} 
      onChange={(e) => setBill(Number(e.target.value))} 
      />

      <label>Your expense</label>
      <input 
       type='text' 
       value={paidByUser} 
        onChange={(e) => 
         setPaidByUser(
           Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
      )} />

      <label> {selectedFriend.name} expense</label>
      <input type='text' disabled value={paidByFriend} />

      <label>Who is paying the bill</label>
      <select 
          value={whoIsPaying} 
          onChange={(e) => setWhoIsPaying(e.target.value)}>

          <option value='user'>You</option>
          <option value='friend'>{selectedFriend.name}</option>
      
      </select>

      <Button>Split bill</Button>
    </form>
  )
}



export default App;



























