let questions, selectedQuestionIds=[], selectedQuestions=[], filtered_questions=[];
$(function() {

    // load the external data
    d3.csv("./assets/data/TRIVIAOUTLETQUIZDATA.csv").then(function(flatData) {
        questions = flatData;
        let q_type = flatData.map(function(d) {
            return d['Q_TYPE']
        });
        q_type = q_type.filter(onlyUnique);
        let cats = flatData.map(function(d) {
            return d['CAT']
        });
        cats = cats.filter(onlyUnique);

        cats.forEach(function(d) {
            $("#quizcategory").append('<option value="' + d + '">' + d + '</option>');
        })

        q_type.forEach(function(d) {
            $("#quiztype").append('<option value="' + d + '">' + d + '</option>');
        })
    });

    $('#step1_submit').on('click', function() {

        // validation check
        if ($("#quizname").val()) {
            let questions = getQuestionsfromCSV($("#quiztype").val(), $("#quizcategory").val());

            $("#questions-table").DataTable({                
                'data': questions,
                'info' : false,
                'columnDefs': [{
                    'targets': 0,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center',
                    'render': function(data, type, full, meta) {
                        return '<input type="checkbox" name="id[]" value="' +full['ID'] + '">';
                    }
                }],
                "select": {
                    'style': 'multi',
                    'selector': 'td:not(:first-child)'
                },
                'order': [1, 'asc'],
                "createdRow": function(row, data, dataIndex) {
                    $(row).attr("id", "tblRow_" + data['ID']);
                    $(row).attr('question-id', data['ID']);
                },
                "columns": [{
                        "data": ""
                    },
                    {
                        "data": "ID"
                    },
                    {
                        "data": "Q_TYPE"
                    },
                    {
                        "data": "CAT"
                    },
                    {
                        "data": "QUESTION"
                    }
                ]
            });

            $("#step1").addClass('hide');
            $("#step2").removeClass('hide');
        } else {
            $("p.error").removeClass('hide');
            setTimeout(function(d) {
                $("p.error").addClass('hide');
            }, 2000);
        }
    });

    $(document).on('click', "#questions-table td", function(){        
        $(this).closest('tr').toggleClass('selected');
        let cuQId = $(this).closest('tr').attr('question-id');
        let checkbox = $(this).closest('tr').find('input[type="checkbox"]')[0];        
        $(checkbox).prop("checked", !$(checkbox).prop("checked"));        
        if(selectedQuestionIds.indexOf(cuQId)==-1){            
            selectedQuestionIds.push(cuQId);
        }else{
            selectedQuestionIds.splice(selectedQuestionIds.indexOf(cuQId), 1);
        }
        $('.numberOfSelectedQs').html(selectedQuestionIds.length + ' questions selected');
        $('.numberOfSelectedQs').removeClass('hide');
    });

    $("#generate_quiz").on('click', function(){                
        $("#questions_ids_hidden").val(selectedQuestionIds);
        
        // filled value to test easily        
        selectedQuestions = filtered_questions.filter(function(d){
            return selectedQuestionIds.indexOf(d['ID'])!=-1
        });        

        $("#step2").addClass('hide');
        $("#step3").removeClass('hide');

        let htmlContent = '<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><title>Welcome to Trivia Outlet</title><style>.half{width:50%;float: left}.quiz{margin-bottom:10px;}.answer-txt:after{content:" ";clear:both;float:none;display: block}.correct.answer{color:red}</style><body><div id="wrapper"><h1>'+$("#quizname").val()+'</h1><div id="quiz-wrapper">';

        selectedQuestions.forEach(function(q){
            htmlContent += '<div class="quiz"><p class="question-txt">Q.'+q['QUESTION']+'</p>';
            htmlContent +='<div class="answer-txt">';
            if(q['A1']){
                if(q['A1'].indexOf('+')!=-1){
                    let answertxt = q['A1'].substring(0, q['A1'].length-1);
                    htmlContent+='<div class="correct half answer">A1. '+answertxt + '</div>';
                }else{
                    htmlContent+='<div class="half answer">A1. '+q['A1'] + '</div>';
                }   
            }   

            if(q['A2']){
                if(q['A2'].indexOf('+')!=-1){
                    let answertxt = q['A2'].substring(0, q['A2'].length-1);
                    htmlContent+='<div class="correct half answer">A2. '+answertxt + '</div>';
                }else{
                    htmlContent+='<div class="half answer">A2. '+q['A2'] + '</div>';
                }   
            }   

            if(q['A3']){
                if(q['A3'].indexOf('+')!=-1){
                    let answertxt = q['A3'].substring(0, q['A3'].length-1);
                    htmlContent+='<div class="correct half answer">A3. '+answertxt + '</div>';
                }else{
                    htmlContent+='<div class="half answer">A3. '+q['A3'] + '</div>';
                }   
            }   

            if(q['A4']){
                if(q['A4'].indexOf('+')!=-1){
                    let answertxt = q['A4'].substring(0, q['A4'].length-1);
                    htmlContent+='<div class="correct half answer">A4. '+answertxt + '</div>';
                }else{
                    htmlContent+='<div class="half answer">A4. '+q['A4'] + '</div>';
                }   
            }   
            htmlContent+='</div>';
            htmlContent+='</div>';
        })

        htmlContent += '</div></body></html>';
        
        $('#htmlcode').val(htmlContent);

        $("#create_new_html_hidden").val('yes');
        $("#quiz-setup-form").submit();
    });

    $("#test_quiz").on('click', function(){

    })
})

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getQuestionsfromCSV(type, cat) {
    filtered_questions = questions.filter(function(d) {
        return d['Q_TYPE'] == type && d['CAT'] == cat
    });
    return filtered_questions;
}