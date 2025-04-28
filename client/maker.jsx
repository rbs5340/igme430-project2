const helper = require('./helper.js');
const React = require('react');
const {useState,useEffect} = React;
const { createRoot } = require('react-dom/client');

const MoneyList = (props) => {
    const [moneys,setMoneys]=useState(props.moneys);
    useEffect(()=>{
        const loadMoneysFromServer = async () => {
            const response = await fetch('/getMoneys');
            const data = await response.json();
            setMoneys(data.moneys);
        };
        loadMoneysFromServer();
    }, [props.reloadMoneys]);

    const handleMoneyInc = async () =>{
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
    if(moneys.length>0){
        buyGV=(moneys[0].growthValue+1)*10
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