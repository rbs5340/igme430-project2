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

    const moneyInc = async () =>{
        moneys[0].points+=moneys[0].clickValue;
        if(moneys[0].premium){
            moneys[0].points+=moneys[0].clickValue;
        }
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
        let buyGV=(moneys[0].growthValue+1)*10;
        if(moneys[0].premium){
            buyGV=parseInt(buyGV/2);
        }
        if(moneys[0].points>=buyGV){
            moneys[0].points-=buyGV;
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
          return true;
        }
        return false;
    }

    const clickInc = async () =>{
        let buyCV=(moneys[0].clickValue+1)*5;
        if(moneys[0].premium){
            buyCV=parseInt(buyCV/2);
        }
        if(moneys[0].points>=buyCV){
            moneys[0].points-=buyCV;
            moneys[0].clickValue++;
            setMoneys([...moneys]);
            const response = await fetch('/set', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                  },
                body: JSON.stringify({ moneys }),
            });
            return true;
        }
        return false;
    }

    const switchPremium = async () => {
        moneys[0].premium = !moneys[0].premium;
        setMoneys([...moneys]);
            const response = await fetch('/set', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json"
                  },
                body: JSON.stringify({ moneys }),
        });
        return true;
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
                <h3 className="moneyPoints">Dollars: {money.points}</h3>
                <h3 className="moneyAge">Click Strength: {money.clickValue}</h3>
                <h3 className="moneyName">Mint Strength: {money.growthValue}</h3>
            </div>
            
        );
    });
    if(moneys.length>0){
        let buyGV=(moneys[0].growthValue+1)*10;
        let buyCV=(moneys[0].clickValue+1)*5;
        if(moneys[0].premium){
            buyGV=parseInt(buyGV/2);
            buyCV=parseInt(buyCV/2);
            return(
                <div className="moneyList">
                    <button id="moneyInc"
                    onClick={(e)=>moneyInc()}
                    name="moneyInc"
                    action="/set"
                    method="GET"
                    className="moneyInc"
                    value="Make Money"
                >Click</button>
                <button id="clickInc"
                    onClick={(e)=>clickInc()}
                    name="clickInc"
                    action="/set"
                    method="GET"
                    className="clickInc"
                    value="Make Click"
                >Upgrade Click - ${buyCV}</button>
                <button id="growInc"
                    onClick={(e)=>growInc()}
                    name="growInc"
                    action="/set"
                    method="GET"
                    className="growInc"
                    value="Make Grow"
                >Upgrade Mint - ${buyGV}</button>
                <button id="premInc"
                    onClick={(e)=>switchPremium()}
                    name="premInc"
                    action="/set"
                    method="GET"
                    className="premInc"
                    value="Make Prem"
                >Premium = ON</button>
                    {moneyNodes}
                </div>
        );
        }else{
            return(
                <div className="moneyList">
                    <button id="moneyInc"
                    onClick={(e)=>moneyInc()}
                    name="moneyInc"
                    action="/set"
                    method="GET"
                    className="moneyInc"
                    value="Make Money"
                >Click</button>
                <button id="clickInc"
                    onClick={(e)=>clickInc()}
                    name="clickInc"
                    action="/set"
                    method="GET"
                    className="clickInc"
                    value="Make Click"
                >Upgrade Click - ${buyCV}</button>
                <button id="growInc"
                    onClick={(e)=>growInc()}
                    name="growInc"
                    action="/set"
                    method="GET"
                    className="growInc"
                    value="Make Grow"
                >Upgrade Mint - ${buyGV}</button>
                <button id="premInc"
                    onClick={(e)=>switchPremium()}
                    name="premInc"
                    action="/set"
                    method="GET"
                    className="premInc"
                    value="Make Prem"
                >Premium = OFF</button>
                    {moneyNodes}
                </div>
        );
        }
        }
    return(
        <div className="moneyList"></div>
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