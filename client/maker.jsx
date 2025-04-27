const helper = require('./helper.js');
const React = require('react');
const {useState,useEffect} = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e,onDomoAdded)=>{
    //console.log("handledomo");
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;

    if(!name||!age){
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action,{name,age},onDomoAdded);
    return false;
};



const DomoForm=(props)=>{
    return(
        <form id="domoForm"
            onSubmit={(e)=>handleDomo(e,props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
        /*<button id="domoInc"
            onClick={(e)=>handleDomoInc(e,props.triggerReload)}
            name="domoInc"
            action="/maker"
            method="GET"
            className="domoInc"
            value="Make Domo"
        >Increment Domo</button>
        */
    );
}

/*const DomoInc = (props) => {
    return(
        
    );
}*/

const DomoList = (props) => {
    const [domos,setDomos]=useState(props.domos);

    useEffect(()=>{
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    const handleDomoInc = async () =>{
        
        for(let i=0;i<domos.length;i++){
            domos[i].points++;
        }
        setDomos([...domos]);
        const response = await fetch('/inc', {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
              },
            body: JSON.stringify({ domos }),
          });
        return false;
    };

    if(domos.length === 0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo=> {
        return(
            <div key={domo.id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoPoints">Points: {domo.points}</h3>
            </div>
            
        );
    });

    return(
        <div className="domoList">
            <button id="domoInc"
            onClick={(e)=>handleDomoInc()}
            name="domoInc"
            action="/inc"
            method="GET"
            className="domoInc"
            value="Make Domo"
        >Increment Domo</button>
            {domoNodes}
        </div>
    );
};

const App = () => {
    const[reloadDomos,setReloadDomos]=useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            {/* <div id="incDomo">
                <DomoInc triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div> */}
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload=init;