/**
 * Created by Administrator on 2018/7/2.
 */


$(function(){
    $('#submit').click(login);
});


function login(){
    let name = $('#name').val();
    let pwd = $('#pwd').val();
    $.ajax({
        url:'/login',
        type:'post',
        data:{
            name:name,
            pwd:pwd
        },
        success:function(data){
            console.log(data);
        }
    });
}