var api_estado_url="https://servicodados.ibge.gov.br/api/v1";
var api_doador_url="https://fiap-covid19.herokuapp.com"; 

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

    console.log(JSON.stringify(model));

    var request = $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: api_doador_url+"/doadores",
        data: JSON.stringify(model)
      });
    
    request.done(function( msg ) {
        toastr.success(msg, 'Doador cadastrado com sucesso!');
    });

    request.fail(function( jqXHR, status ) {
        toastr.error( "Requisão falhou: " + status, 'Erro ao cadastrar' );
    });
}

function loadDoadores(tipoSanguineo,cidade){   
    var params = "";
    if(cidade > 0 && tipoSanguineo!= "") {
     params = "?tipoSanguineo="+tipoSanguineo+"&cidade="+cidade;
    }
    var jqxhr = $.get( api_doador_url+"/doadores"+params, function(estados) {
        $.each(estados, function(index, obj) {
            var linha = "<tr><td></td>"
            +"<td>"+obj.nome+"</td>"
            +"<td>"+obj.idade+"</td>"
            +"<td>"+obj.tipoSanguineo+"</td>"
            +"<td>"+obj.cpf+"</td>"
            +"<td>"+obj.telefone+"</td>"
            +"<td>"+obj.email+"</td>"
            +"<td>"+obj.UF+"</td>"
            +"<td>"+obj.cidade+"</td>"
            +"<td><i class='fa fa-edit' onclick='updateDoador("+obj.id+")'></i> <i class='fa fa-remove' onclick='removeDoador("+obj.id+")'></i></td>"
            +"</tr>";
            $(linha).appendTo("#lista-doadores");
        });
        if(estados.length == 0){
            toastr.info('Nenhum registro encontrado!');}
        else{
            
            toastr.success("Qtd: "+estados.length, 'Busca efetuada com sucesso!');
        }
    })
    .done(function() {
    })
    .fail(function() {        
        toastr.error('Erro ao buscar informações!');
    })
    .always(function() {
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
        $(item).trigger('ready');
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
            $("<option data-id=\""+obj.id+"\" value=\""+obj.id+"\">"+obj.sigla+" - "+obj.nome+"</option>").appendTo("#UF");
            $("<option data-id=\""+obj.id+"\" value=\""+obj.id+"\">"+obj.sigla+" - "+obj.nome+"</option>").appendTo("#UFDoador");
        });
    });

    $("body").on("change","#UF", function(obj){
        var uf = $("#UF").find(":selected").data("id");
        $(".cidade").remove();
        $.get(api_estado_url+"/localidades/estados/"+uf+"/municipios",function(cidades){
            $.each(cidades, function(index, obj) {
                $("<option class='cidade' value=\""+obj.id+"\">"+obj.nome+"</option>").appendTo("#cidade");
            });
        });
    });
    
    $("body").on("change","#UFDoador", function(obj){
        var uf = $("#UFDoador").find(":selected").data("id");
        $(".cidade").remove();
        $.get(api_estado_url+"/localidades/estados/"+uf+"/municipios",function(cidades){
            $.each(cidades, function(index, obj) {
                $("<option class='cidade' value=\""+obj.id+"\">"+obj.nome+"</option>").appendTo("#CidadeDoador");
            });
        });
    });


    $("body").on("click","#okDoador",function(){
        loadDoadores($("#tiposanguineoDoador").val(),$("#CidadeDoador").val());
    });

    toastr.options = {
        "positionClass": "toast-top-right",
      };
});
