function articleJournal(pmcArticle, settings){
  var journ = pmcArticle.journalInfo.journal.isoabbreviation +'&nbsp;'+
              pmcArticle.journalInfo.dateOfPublication +';'+
              pmcArticle.journalInfo.volume + '('+
              pmcArticle.journalInfo.issue + '):' +
              pmcArticle.pageInfo;
  return journ;
}

function articleTitle(pmcArticle, settings){
  var title = $('<div>').attr('class', 'title').append($('<strong>').text(pmcArticle.title));
  return title;
}

function articalLinks(pmcArticle, type, settings){
  var links = $('<div>').attr('class', 'links');
  links.append('PMID: ' + pmcArticle.pmid + ' ')
  links.append($('<a>').attr({
    href: 'http://europepmc.org/abstract/MED/'+pmcArticle.pmid,
    onclick: "trackResourceLink('Europe PMC','http://europepmc.org/abstract/MED/"+pmcArticle.pmid+"'); return false;"
  }).text('Europe PMC'))
  links.append('&nbsp;')
  links.append($('<a>').attr({
    href: 'http://www.ncbi.nlm.nih.gov/pubmed/'+pmcArticle.pmid,
    onclick: "trackResourceLink('PubMed','http://www.ncbi.nlm.nih.gov/pubmed/"+pmcArticle.pmid+"'); return false;"
  }).text('Pubmed'));
  links.append('&nbsp;');
  var toggle = $('<i>').attr({
    id: pmcArticle.pmid+'-toggle-'+type,
    class: 'material-icons'
  }).css({
    verticalAlign: 'text-bottom',
    fontSize: settings.iconSize,
    cursor: 'pointer'
  });
  if(type == 'plus'){
    toggle.text('add_box');
    toggle.click(function(event){
      $('#'+pmcArticle.pmid+'-more').css('display', 'block');
      $('#'+pmcArticle.pmid+'-less').css('display', 'none');
    });
  }
  else if(type == 'minus'){
    toggle.text('indeterminate_check_box');
    toggle.click(function(event){
      $('#'+pmcArticle.pmid+'-more').css('display', 'none');
      $('#'+pmcArticle.pmid+'-less').css('display', 'block');
    });
  }
  links.append(toggle);
  return links;
}

function lessArticle(pmcArticle, settings){
  var articleLess = $('<div>').attr({
    'id': pmcArticle.pmid+'-less',
    'class': 'article'
  });
  var title = articleTitle(pmcArticle, settings);
  var authJourn = $('<div>').attr('class', 'auth-journ');
  authJourn.append(pmcArticle.authorList.author[0].fullName + '&nbsp;');
  authJourn.append($('<em>').text('et al.'));
  authJourn.append('&nbsp;');
  authJourn.append(articleJournal(pmcArticle, settings));
  var links = articalLinks(pmcArticle, 'plus', settings);

  articleLess.append(title);
  articleLess.append(authJourn);
  articleLess.append(links);
  return articleLess;
}

function moreArticle(pmcArticle, settings){
  var articleMore = $('<div>').attr({
    'id': pmcArticle.pmid+'-more',
    'class': 'article'
  }).css({display: 'none'});
  var title = articleTitle(pmcArticle);
  var authors = $('<div>').attr('class', 'authors').append(pmcArticle.authorString);
  var journal = $('<div>').attr('class', 'journal').append(articleJournal(pmcArticle));
  var links = articalLinks(pmcArticle, 'minus', settings);
  
  articleMore.append(title);
  articleMore.append(authors);
  articleMore.append(journal);
  if(pmcArticle.abstractText !== ' '){
    articleMore.append($('<div>').attr('class', 'abstract').append('Abstract: '+pmcArticle.abstractText));
  }
  articleMore.append(links);
  return articleMore;
}

function checkSettings(settings){
  var settings = (typeof settings === 'undefined') ? {} : settings;
  settings.spinnerColor = settings.spinnerColor ? settings.spinnerColor : '#000'; 
  settings.iconSize     = settings.iconSize     ? settings.iconSize     : '18px';
  return settings;
}

function getPMCReferences(settings){
  settings = checkSettings(settings);
  var count = 0;
  $('.pubmed').each(function(index, pubmed) {
    count++;
    var pmids = $(pubmed).attr('data-pubmed-ids');
    $('<div>').attr({class: 'pmcspinner'}).css({margin: '0 auto', width: '10%'}).appendTo($(pubmed));
    $(pubmed).find(".pmcspinner").spinner({dashes: 120, innerRadius: 10, outerRadius: 15, color: settings.spinnerColor});
    var res_div = $('<div>').attr({class: 'articles'});
    
    var pmidsAry = pmids.split(',');
    var query = pmidsAry.map(function(pmid) {
      return 'ext_id:'+pmid;
    }).join(' OR ');
    
    var jqxhr = $.getJSON("http://www.ebi.ac.uk/europepmc/webservices/rest/search/query="+query+"&resulttype=core&format=json&callback=?", function(data) {
      for (var i = data.resultList.result.length - 1; i >= 0; i--) {
        var articleLess = lessArticle(data.resultList.result[i], settings);
        var articleMore = moreArticle(data.resultList.result[i], settings);
        res_div.append(articleLess);
        res_div.append(articleMore);
        if(i == 0){
          articleMore.css({
            'margin-bottom': '0'
          });
          articleLess.css({
            'margin-bottom': '0'
          });
        }
      };
    });
    
    jqxhr.done(function() {
      $(pubmed).find(".pmcspinner").remove();
      $(pubmed).empty();
      res_div.appendTo($(pubmed));
    });
    
    jqxhr.fail(function() {
      $(pubmed).find(".pmcspinner").remove();
      var links = $('<div>').attr('class', 'links');
      var ul = $('<ul>').css({
        'list-style-type' : 'none',
        'padding-left'    : 0,
        'margin'          : 0
      });
      for (var i = 0; i < pmidsAry.length; i++) {
        var li = $('<li>');
        li.append('PMID: ' + pmidsAry[i] + ' ');
        li.append($('<a>').attr({
          href: 'http://europepmc.org/abstract/MED/'+pmidsAry[i],
          target: '_blank'
        }).text('Europe PMC'));
        li.append(' ');
        li.append($('<a>').attr({
          href: 'http://www.ncbi.nlm.nih.gov/pubmed/'+pmidsAry[i],
          target: '_blank'
        }).text('Pubmed'));
        li.appendTo(ul);
      };
      ul.appendTo(pubmed);
    });
    
  });
}
