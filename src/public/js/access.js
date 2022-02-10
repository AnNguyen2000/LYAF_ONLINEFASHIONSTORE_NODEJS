//change form event:
const link_register_btn = document.querySelector('.link_register_btn');
const form__login = document.querySelector('.form__login');
const form__register = document.querySelector('.form__register');
const form__logo = document.querySelector('.form__logo');
const form__title_name = document.querySelector('.form__title--name');
const pass_issues = document.querySelector('#pass_issues');
const social__link = document.querySelector('.social__link');
const register_ask_toast = document.querySelector('.register_ask_toast');
//Edit Form:
//form login:
form__login.style.height =`calc(${window.getComputedStyle(form__login).getPropertyValue('width')} + 160px)`;
window.addEventListener('resize', (e) =>{
    form__login.style.height = `calc(${window.getComputedStyle(form__login).getPropertyValue('width')} + 160px)`;
});

//Access:
const link_login_btn = document.querySelector('.link_login_btn');
if(link_register_btn != null){
    link_register_btn.addEventListener('click',() =>{
        window.location.href = "/register";
    });
}

if(link_login_btn != null){

    link_login_btn.addEventListener('click',() =>{
        window.location.href = "/login";
    });
}

//Responsive Form:
function changeHeight_420(x) {
    if (x.matches) { // If media query matches
        form__login.style.height =`calc(${window.getComputedStyle(form__login).getPropertyValue('width')} + 200px)`;
        window.addEventListener('resize', (e) =>{
            form__login.style.height = `calc(${window.getComputedStyle(form__login).getPropertyValue('width')} + 200px)`;
        });
        form__title_name.style.fontSize = '25px';
        pass_issues.style.fontSize = '15px';
        register_ask_toast.style.fontSize = '12px';
    } 
  }

function changeHeight_400(x) {
    if (x.matches) { // If media query matches
        form__login.style.height =`calc(${window.getComputedStyle(form__login).getPropertyValue('width')} + 250px)`;
        window.addEventListener('resize', (e) =>{
            form__login.style.height = `calc(${window.getComputedStyle(form__login).getPropertyValue('width')} + 250px)`;
        });
        form__title_name.style.fontSize = '25px';
        pass_issues.style.fontSize = '15px';
        register_ask_toast.style.fontSize = '12px';
    } 
  }

changeHeight_400(window.matchMedia("(max-width: 420px)"));
changeHeight_420(window.matchMedia("(max-width: 420px)"));
 
//errorToast:
const errorToast = document.querySelector('.errorToast');
if(document.querySelector('#error') != null){
    errorToast.style.animation = " errorToast 5s";
    setTimeout(() => {  
        errorToast.style.right = "0px";
        errorToast.style.opacity = "0";
    }, 3000);
}
