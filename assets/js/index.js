var api_estado_url="https://servicodados.ibge.gov.br/api/v1";
var api_doador_url=""; 

function createDoador(){
    var model = {
        nome: $("#nome").val(),
        tipoSanguineo: $("#tipoSanguineo").val(),
        cidade: $("#cidade").val(),
        UF: $("#UF").val(),
        idade: $("#idade").val(),
        cpf: $("#cpf").val(),
        email: $("#email").val(),
        telefone: $("#telefone").val(),
    };
    console.log(model);
    alert(model);
    alert(JSON.stringify(model));

    var request = $.ajax({
        method: "POST",
        url: api_doador_url,
        data: model
      });
    
    request.done(function( msg ) {
        alert("Doador cadastrado com sucesso");
    });

    request.fail(function( jqXHR, status ) {
        alert( "Requisão falhou: " + status );
    });
}

function hide(){
    $(".conteudo").hide();
}

function menu(){
    $(".menu.nav-link").on('click',function(){
        hide();
        var item = $(this).attr("href");
        $(item).show();
    });
}


$(document).ready(function(){
    menu();
    
    $.get(api_estado_url+"/localidades/estados",function(estados){
        estados.sort(function (a, b) {
            if (a.sigla > b.sigla) return 1;
            if (a.sigla < b.sigla) return -1;
            return 0;
        });
        $.each(estados, function(index, obj) {
            $("<option data-id=\""+obj.id+"\" value=\""+obj.nome+"\">"+obj.sigla+" - "+obj.nome+"</option>").appendTo("#UF");
        });
    });

    $("body").on("change","#UF", function(obj){
        var uf = $("#UF").find(":selected").data("id");
        $(".cidade").remove();
        $.get(api_estado_url+"/localidades/estados/"+uf+"/municipios",function(cidades){
            $.each(cidades, function(index, obj) {
                $("<option class='cidade' value=\""+obj.nome+"\">"+obj.nome+"</option>").appendTo("#cidade");
            });
        });
    })
});
