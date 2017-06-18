// ==UserScript==
// @name        Asana counter
// @namespace   test
// @description Asana counter
// @include     https://app.asana.com/*
// @version     1
// @grand       none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @require     https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js
// ==/UserScript==

(function() {
    Mousetrap.bind(['command+k', 'ctrl+k'], function(e) {
        //console.log("whee");
        //console.log(getTotalHours());
        alert(getTotalHours());
        return false;
    });

    //    var taskName =$(row).find("textarea").val();
})();
/*
window.setInterval(function(){

    if ($("#project_notes").length>0)
    {
      if ($("#scify-hours").length===0)
            $(getTemplate()).insertAfter("#project_notes .loading-boundary");     

        $("#scify-hours").find(".total").text(getTotalHours());    
      getHoursPerName();
    }

    //console.log(getTotalHours());



},2000);
*/
var runningSum = 0;

function getTotalHours(){
    var hours=0;
    $("#grid").find("tr").each(function(i,row){
        var textArea = $(row).find("textarea");
        var taskName = textArea.val();   
        if (!$(row).hasClass("grid-row-selected")) {
            return true;
        }

        //console.log(taskName);
        var currentNum = 0;
        var myRegexp = /\[(\d+|\d+\.\d+)\]/g;
        try {
            var match = myRegexp.exec(taskName);
            //console.log(match[1]);
            currentNum = parseFloat(match[1]);
        } catch (err) {}
        hours += currentNum;

        textArea.select(function(){
            // does not work as expected on multiselect (asana generates multiple select events for last value?)
            // another problem - new values when you scroll (if you don't add handlers regularly)

            //option - when side panel with multiple things selected is visible - do full count loop and then on any select or blur do full count loop
            console.log(taskName+ " selected");
            runningSum += currentNum;
            console.log("sum "+ runningSum);
        });

        textArea.blur(function() {
            runningSum -= currentNum;
        });

        //console.log(getEventsList($(row)));
        //console.log($._data( $(row), "events" ));
        textArea.on(getEventsList(textArea), function(e) {
            console.log(e);
        });

    });
    return hours;
}

function getEventsList($obj) {
    var ev = new Array(),
        events = $obj.data('events'),
        i;
    for(i in events) { ev.push(i); }
    return ev.join(' ');
}

