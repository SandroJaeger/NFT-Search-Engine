// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyDttxxVrooFSbmMeqxC2QgrLP9keT45WT4",
  
    authDomain: "nft-project-b286f.firebaseapp.com",
  
    databaseURL: "https://nft-project-b286f-default-rtdb.firebaseio.com",
  
    projectId: "nft-project-b286f",
  
    storageBucket: "nft-project-b286f.appspot.com",
  
    messagingSenderId: "390564185484",
  
    appId: "1:390564185484:web:884a5f884258fb11efc2a9"
  
};
  
  
// Initialize Firebase
  
firebase.initializeApp(firebaseConfig);
  







function searchToggle(obj, evt){
    var container = $(obj).closest('.search-wrapper');
        if(!container.hasClass('active')){
            container.addClass('active');
            evt.preventDefault();
        }
        else if(container.hasClass('active') && !$(obj).closest('.input-holder').length == 0){
            var searchinput = document.querySelector(".search-input").value;
            window.location.search = `?accountid=${searchinput}`;
        }
        else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
            container.removeClass('active');
            // clear input
            container.find('.search-input').val('');
        }
}



let parameters = new URLSearchParams(window.location.search);
var accountID = parameters.get("accountid");

if(accountID != null){
    document.querySelector(".search-wrapper").style.display = "none";
    var propertynfts;
    firebaseRef = firebase.database().ref("Users/"+accountID+"/NFTs");
    firebaseRef.on("value", function(data){
        value = data.val();
        propertynfts = Object.keys(value);
        generatenfts();
    });
}





function generatenfts(){
    document.querySelector(".loader-img2").style.display = "block";
    if(document.querySelector(".card")){
        [...document.getElementsByClassName("card")].forEach(function(e){
        e.remove();
        });
    }
    var username;
    firebaseRef = firebase.database().ref("Users/"+accountID+"/username");
    firebaseRef.on("value", function(data){
        username = data.val();
        const newdiv = document.createElement('div');
        newdiv.classList = `card`;
        newdiv.innerHTML = `
        <h2 class="h2heading">NFT Collection from</h2>
        <div class="reveal-box enter animate">
            <div class="reveal-box__inner">
                <h1 class="h1heading">${username}</h1>
            </div>
        </div>
        `
        document.body.appendChild(newdiv);
    });
    propertynfts.forEach(function(e){
        var img = "";
        firebaseRef = firebase.database().ref("Users/"+accountID+"/NFTs/"+e);
        firebaseRef.child("img").once("value", function(data){
          firebase.storage().ref(data.val()).getDownloadURL().then(imgUrl => {
            img = imgUrl;
          });
        });
        setTimeout(function(){
            createNFTcard(img,e);
            document.querySelectorAll(".card .nft-img").forEach((img) => {
                img.addEventListener("mousedown", showbuttonclicked);
            }); 
        },2000);
        setTimeout(function(){
            document.querySelector(".loader-img2").style.display = "none";
            [...document.getElementsByClassName("card")].forEach(function(e){
                e.style.display = "flex";
            });
        },4000);
    });
    
}


function createNFTcard (img,e) {
    const newdiv = document.createElement('div');
    newdiv.id = `${e}`;
    newdiv.classList = `card`;
    newdiv.innerHTML = `
    <div class="reveal-box enter animate">
        <div class="reveal-box__inner">
          <img id="reveal-box__image" class="nft-img" src='${img}' /> <!-https://images.unsplash.com/photo-1597600159211-d6c104f408d1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=739&q=80->
        </div>
    </div>
    `
    document.body.appendChild(newdiv);
}





function showbuttonclicked(event){
    const lightbox = document.createElement('div');
    lightbox.classList = `lightbox`;
    document.body.appendChild(lightbox);
    const enlargedimg = document.createElement('img');
    enlargedimg.src = event.currentTarget.src;
    lightbox.appendChild(enlargedimg);
    lightbox.addEventListener("mousedown", function(){
      lightbox.remove();
    });
  }