const helper = require('./helper.js');
const React = require('react');
const {useState,useEffect} = React;
const { createRoot } = require('react-dom/client');

/*
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

    helper.sendPost(e.target.action,{},onDomoAdded);
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
        <button id="domoInc"
            onClick={(e)=>handleDomoInc(e,props.triggerReload)}
            name="domoInc"
            action="/maker"
            method="GET"
            className="domoInc"
            value="Make Domo"
        >Increment Domo</button>
        
    );
}
*/

const MoneyList = (props) => {
    const [moneys,setMoneys]=useState(props.moneys);
    debugger
    //console.log("TEST");
    //console.log("MoneyList Moneys: "+JSON.stringify(moneys));
    useEffect(()=>{
        const loadMoneysFromServer = async () => {
            const response = await fetch('/getMoneys');
            const data = await response.json();
            setMoneys(data.moneys);
        };
        loadMoneysFromServer();
    }, [props.reloadMoneys]);

    const handleMoneyInc = async () =>{
        //console.log("test hello hi");
        moneys[0].clickValue++;
        moneys[0].points+=moneys[0].clickValue;
        setMoneys([...moneys]);
        const response = await fetch('/set', {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
              },
            body: JSON.stringify({ moneys }),
          });
        return false;
    };

    const growInc = async () =>{
        moneys[0].growthValue++;
        setMoneys([...moneys]);
        const response = await fetch('/set', {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
              },
            body: JSON.stringify({ moneys }),
          });
        return false;
    }

    const moneyGrow = () =>{
        setMoneys((moneys)=>{
            console.log(moneys);
            moneys[0].points+=moneys[0].growthValue;
            fetch('/set', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                  },
                body: JSON.stringify({ moneys }),
              });
            return[...moneys];
        });
        
        
        return false;
    }

    useEffect(() => {
        let timer = setTimeout(function loop() {
            moneyGrow();
            timer=setTimeout(loop,1000);
        }, 1000);
        return () => clearTimeout(timer);
      }, [])

    const moneyNodes = moneys.map(money=> {
        return(
            <div key={money.id} className="money">
                <h3 className="moneyName">Grow: {money.growthValue}</h3>
                <h3 className="moneyAge">Click: {money.clickValue}</h3>
                <h3 className="moneyPoints">Points: {money.points}</h3>
            </div>
            
        );
    });
    console.log("MONEYSSSS: "+moneys);
    if(moneys.length>0){
        buyGV=(moneys[0].growthValue+1)*10
        console.log("TRUE!");
        console.log("GV: "+moneys[0].growthValue);
        return(
            <div className="moneyList">
                <button id="moneyInc"
                onClick={(e)=>handleMoneyInc()}
                name="moneyInc"
                action="/set"
                method="GET"
                className="moneyInc"
                value="Make Money"
            >Increment Money</button>
            <button id="moneyInc"
                onClick={(e)=>growInc()}
                name="growInc"
                action="/set"
                method="GET"
                className="growInc"
                value="Make Grow"
            >Increment Growth - ${buyGV}</button>
                {moneyNodes}
            </div>
    )}
    return(
        <div className="moneyList">
            <button id="moneyInc"
            onClick={(e)=>handleMoneyInc()}
            name="moneyInc"
            action="/set"
            method="GET"
            className="moneyInc"
            value="Make Money"
        >Increment Money</button>
        <button id="moneyInc"
            onClick={(e)=>growInc()}
            name="growInc"
            action="/set"
            method="GET"
            className="growInc"
            value="Make Grow"
        >Increment Growth</button>
            {moneyNodes}
        </div>
    
    );
};

const App = () => {
    const[reloadMoneys,setReloadMoneys]=useState(false);

    return (
        <div>
            {/*<div id="makeMoney">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>*/}
            <div id="moneys">
                <MoneyList moneys={[]} reloadMoneys={reloadMoneys} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload=init;