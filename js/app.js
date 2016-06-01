;var APP = {
    start: 1,
    end: 16,
    file_path: "data/cities.csv",
    delta: 15
};


window.addEventListener('load' , function(){
    var delta,
        nextPage,
        prevPage;
    delta = APP.delta;


    var xhr = new XMLHttpRequest();
    xhr.open('GET', APP.file_path, true);
    xhr.responseType = 'blob';

    xhr.onload = function(e) {
        if (this.status == 200) {
            APP.file = xhr.response;

            var file = APP.file,
                reader;

            reader = new FileReader();
            reader.onload = function(e) {
                APP.lines = this.result.split('\n');
                APP.setItem();
            }
            reader.readAsText(file);

            nextPage = document.getElementById('nextPage');
            prevPage = document.getElementById('prevPage');
            prevPage.style.display = "none";
            nextPage.addEventListener('click', function(e){
                APP.start += delta;
                APP.end += delta;
                APP.setItem(APP.start,APP.end);
            });
            prevPage.addEventListener('click',function(e){
                APP.start -= delta;
                APP.end -= delta;
                APP.setItem(APP.start,APP.end);
            });
        }
    };

    xhr.send();
});


APP.setItem = function(start,end){
    var start = start || 1;
    var end = end || 16;
    var prevPage = document.getElementById('prevPage');
    var nextPage = document.getElementById('nextPage');
    var li,
        span,
        small,
        item,
        length;
    var lines = APP.lines;

    if(start === 1){
        prevPage.style.display = "none";
    }else{
        prevPage.style.display = "inline-block";
    }
    if(end < APP.lines.length){
        nextPage.style.display = "inline-block";
    }else{
        nextPage.style.display = "hidden";
    }

    var page = (end - 1)/APP.delta;
    window.history.pushState( {} , '/page/' + page, '?page/' + page );

    document.querySelector('#listContent').innerHTML = '';
    for(var line = start; line < end; line++){

        item = APP.genereteItem( lines[line] ) ;
        if(item) {
            li = document.createElement('li');
            length = item.length;

            span = document.createElement('span');
            span.innerText = item[1];
            li.appendChild(span);

            span.appendChild(document.createTextNode(', ' + item[4]));
            li.appendChild(span);

            small = document.createElement('small');
            small.innerText = item[2];
            li.appendChild(small);

            if(line < APP.lines.length - 1) {
                document.querySelector('#listContent').appendChild(li);
            }
        }
    }
};


APP.genereteItem = function(s){
    var line_array = APP.CSVtoArray(s);
    return line_array;
}


APP.CSVtoArray = function(text) {
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    var a = [];                     // Initialize array to receive values.
    if(text) {
        text.replace(re_value,
            function(m0, m1, m2, m3) {
                if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return '';
            });
        if (/,\s*$/.test(text)) a.push('');
        return a;
    }
    return false;

};