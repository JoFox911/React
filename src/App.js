import { useState, useRef } from 'react';

import { Table, Button, Form, Modal } from 'react-bootstrap';

function convertTokensIdsStringToArray(tokenIds) {
  const tokenIdsArray = tokenIds.split(',')
  return tokenIdsArray.map(tokenId => tokenId.trim())
}

const Footer = () => {
  return (
    <footer className="text-black-50 text-center py-3">
      © {new Date().getFullYear()} Your Company. All rights reserved.
    </footer>
  );
};

function InsertedItemsTable({items, onDeleteItemClick}) {
  return (
    <Table striped bordered hover>
      {/* {JSON.stringify(items)} */}
      <thead>
        <tr>
          <th>Valet</th>
          <th>Tokens</th>
          <th className="action-column"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((row, index) => (
          <tr key={index}>
            <td>{row.valet}</td>
            <td>{row.tokenIdsArray.join(',')}</td>
            <td>
              <Button variant="danger" onClick={() => onDeleteItemClick(index)}>
                X
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function InputTokensForm({ onSubmitClick }) {
  const [valet, setValet] = useState("");
  const [tokenIds, setTokenIds] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmitClick({ valet, tokenIdsArray: convertTokensIdsStringToArray(tokenIds) });
    setValet("")
    setTokenIds("")
  };

  const isButtonDisabled = valet === "" || tokenIds === "";

  return (
    <Form onSubmit={handleSubmit} className="main-form" >
      <Form.Control
        type="text"
        placeholder="Enter valet"
        value={valet}
        onChange={(e) => setValet(e.target.value)}
      />

      <Form.Control
        type="text"
        placeholder="Enter tokenIds"
        value={tokenIds}
        onChange={(e) => setTokenIds(e.target.value)}
      />

      <Button variant="primary" type='submit' disabled={isButtonDisabled}>
        Submit
      </Button>
    </Form>
  );
}

// const MyModal = ({showModal, onModalClose}) => {
//   const [inputValue, setInputValue] = useState('');

//   const handleCloseModal = () => {
//     onModalClose();
//   };



//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleSubmit = () => {
//     // Do something with the input value (e.g., submit the form)
//     console.log(inputValue);

//     // Close the modal
//     handleCloseModal();
//   };

//   return (
//     <>
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Modal with One Input</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Control
//             type="text"
//             placeholder="Enter something..."
//             value={inputValue}
//             onChange={handleInputChange}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleSubmit}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// const FilePickerSample = () => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//     console.log(selectedFile)
//   };

//   return (
//     <div>
//       <Form>
//         <Form.Group>
//           <Form.Control type="file" accept="text/plain" onChange={handleFileChange} />
//         </Form.Group>
//       </Form>
//     </div>
//   );
// };

const FileUploader = ({onInsertedItemsLoaded}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the file type is .txt
    if (file.type !== 'text/plain') {
      alert('Please select a .txt file.');
      return;
    }

    try {
      const content = await readFileContent(file);
      parseFileContent(content)
    } catch (error) {
      alert('Error reading the file.');
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        resolve(content);
      };
      reader.onerror = () => {
        reject();
      };
      reader.readAsText(file);
    });
  };

  const parseFileContent = (content) => {
    const rows = content.split('\n');
    const insertedItems = []

    rows.forEach((row) => {
      const [valet, tokenIds] = row.split(":")
      insertedItems.push({
        valet: valet.trim(),
        tokenIdsArray: convertTokensIdsStringToArray(tokenIds)
      })
    });
    onInsertedItemsLoaded(insertedItems)
  };

  const handleLabelClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label onClick={handleLabelClick} style={{ cursor: 'pointer' }}>
             Choose a .txt File
        </Form.Label>
        <Form.Control
          type="file"
          accept="text/plain"
          id="fileInput"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button variant="primary" as="label" htmlFor="fileInput">
          Upload File
        </Button>
      </Form.Group>
    </Form>
  );
};

export default function App() {
  const [insertedItems, setNewItem] = useState([]);
  // const [showModal, setShowModal] = useState(false);

  function addNewItem(newItem) {
    const nextItems = insertedItems.slice()

    const itemWithSameAddress = nextItems.find(existedItem => existedItem.valet === newItem.valet)
    if (itemWithSameAddress) {
      itemWithSameAddress.tokenIdsArray = [...new Set([...itemWithSameAddress.tokenIdsArray, ...newItem.tokenIdsArray])]
    } else {
      nextItems.push(newItem)
    }
    setNewItem(nextItems)
  }

  function addNewItemsArray(newItems) {
    const nextItems = insertedItems.slice()

    newItems.forEach(newItem => {
      const itemWithSameAddress = nextItems.find(existedItem => existedItem.valet === newItem.valet)
      if (itemWithSameAddress) {
        itemWithSameAddress.tokenIdsArray = [...new Set([...itemWithSameAddress.tokenIdsArray, ...newItem.tokenIdsArray])]
      } else {
        nextItems.push(newItem)
      }
    })

    setNewItem(nextItems)
  }

  function removeItem(index) {
    const nextItems = [...insertedItems.slice(0, index), ...insertedItems.slice(index + 1)];
    setNewItem(nextItems)
  }

  // const handleShowModal = (value) => {
  //   setShowModal(value);
  // };


  return (
    <div className="page-container">
      <h1 className="main-title text-white">App Name</h1>
      <div className="info-container">
       {/* <Button variant="primary" onClick={() => handleShowModal(true)}>
          Open Modal
        </Button>

        <MyModal showModal={showModal} onModalClose={() => handleShowModal(false)}/> */}

        <FileUploader onInsertedItemsLoaded={addNewItemsArray}/>

        <InputTokensForm onSubmitClick={addNewItem}/>
       
        {
          insertedItems.length > 0 && 
          <div>
            <InsertedItemsTable items={insertedItems} onDeleteItemClick={removeItem} />
          </div>
        }
      </div>
      <Footer/>
    </div>
  );
}
