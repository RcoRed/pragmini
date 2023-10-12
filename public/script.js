// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC86qF-9coIvx3d_xEX9Ca1CY7nnV60mCw",
  authDomain: "pragmini.firebaseapp.com",
  databaseURL: "https://pragmini-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pragmini",
  storageBucket: "pragmini.appspot.com",
  messagingSenderId: "607504926533",
  appId: "1:607504926533:web:6e79416551515731caa02c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {getDatabase, ref, get, set, child, update, remove} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const db = getDatabase();
const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".days");
const prevNext = document.querySelectorAll(".icons span ");

let allMonthDate = {};

let passato = "";
let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

async function readAllData(year,month){
    let dbref = ref(db);
    //lettura dati dal db
    let dbDate = await get(child(dbref,"date/" + year + "/" + month));
    allMonthDate = dbDate.val();

    renderCalendar();
}

readAllData(currYear,currMonth + 1);

let todayDate = new Date();

//creazione della data completa corrente
let todayFullDate = (todayDate.getDate()) + "-" + (todayDate.getMonth()+1) + "-" + todayDate.getFullYear();

const audio = new Audio();

function saluto(){
    audio.src = "audio/Si.mp3";
    audio.play();
    set(ref(db, "date/" + currYear + "/" + (currMonth + 1) + "/" + todayDate.getDate()),{
        giorno: todayDate.getDate(),
        mese: currMonth+1,
        anno: currYear,
        giornoSettimana: todayDate.getDay(),
        dataCompleta: todayFullDate,
        passato: "si"
    });
}

function giustifica(){
    audio.src = "audio/Giustifica.mp3";
    audio.play();
    set(ref(db, "date/" + currYear + "/" + (currMonth + 1) + "/" + todayDate.getDate()),{
        giorno: todayDate.getDate(),
        mese: currMonth+1,
        anno: currYear,
        giornoSettimana: todayDate.getDay(),
        dataCompleta: todayFullDate,
        passato: "giustifica"
    });
}

function no(){
    audio.src = "audio/No.mp3";
    audio.play();
    set(ref(db, "date/" + currYear + "/" + (currMonth + 1) + "/" + todayDate.getDate()),{
        giorno: todayDate.getDate(),
        mese: currMonth+1,
        anno: currYear,
        giornoSettimana: todayDate.getDay(),
        dataCompleta: todayFullDate,
        passato: "no"
    });
}


const buttonFatto = document.querySelector(".green");
buttonFatto.addEventListener("click", saluto);

const buttonGiustifica = document.querySelector(".yellow");
buttonGiustifica.addEventListener("click", giustifica);

const buttonNo = document.querySelector(".red");
buttonNo.addEventListener("click", no);

//gestione calendario

const months = ["January","February","March","April","May","June","July","August","Septmber","October","November","December"];
const renderCalendar = () =>{
    let firstDayofTheMonth = new Date(currYear,currMonth  ,0 ).getDay(),
    lastDateOfMonth = new Date(currYear,currMonth +1,0).getDate(),
    lastDayofMonth = new Date(currYear,currMonth,lastDateOfMonth).getDay(),
    lastDateOfLastMonth = new Date(currYear,currMonth ,0).getDate();
    let liTag="";

    for(let i = firstDayofTheMonth ; i >0; i--){
        liTag += `<li class = "inactive">${lastDateOfMonth - i + 1}</li>`;
    }
    
    for(let i= 1 ; i<=lastDateOfMonth; i++){
        let isToday = i===date.getDate() && 
                    currMonth === new Date().getMonth() && 
                    currYear === new Date().getFullYear() ? "active":"";
        //allMonthDate
        
        for (let key in allMonthDate){
            if(key == i){
                switch(allMonthDate[key].passato){
                    case "si": 
                        passato = "greenCalendar";
                    break;
                    case "giustifica":
                        passato = "yellowCalendar";
                    break;
                    case "no":
                        passato = "redCalendar";
                    break;
                    default: 
                        passato = "";
                }
                
            }
        }
        console.log(passato);
        liTag += `<li class ="${isToday}"><div class = "${passato}">${i}</div></li>` ;
        passato = "";
    }

    for(let i = lastDayofMonth ; i <6 ; i++){
        liTag += `<li class = "inactive">${i-lastDayofMonth + 1}</li>`;
    }


    currentDate.innerText= `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
}

prevNext.forEach(icon=>{
    icon.addEventListener("click",()=>{
        currMonth=icon.id ==="prev" ? currMonth -1 : currMonth+1;

        if (currMonth < 0|| currMonth >11) {
            date = new Date(currYear,currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }else{
            date = new Date()
        }
        renderCalendar();
    });
});