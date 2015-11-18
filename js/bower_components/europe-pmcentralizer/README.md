# europe-pmcentralizer
Javascript which takes a PubMed ID and converts it to a full reference + abstract div by querying Europe PMC
## Introduction
Takes pubmed ids from a data-pubmed-ids attribute and creates references for each valid pubmed id from europe pubmed central. The by default a short reference is created but by clicking on the expand icon the abstract and the full author list is revealed.
## Install
To install europe-pmcentralizer the easiest way would be to install [bower](http://bower.io) as described in the bower documentation and then simply run the following in your js directory:
```sh
$ bower install git://github.com/KrisGray/europe-pmcentralizer.git
```
## Dependencies
Javascript dependencies:
- [jQuery ~2.1.4](https://github.com/jquery/jquery)
- [Raphael ~2.1.4](https://github.com/DmitryBaranovskiy/raphael)
- [jquery.raphael.spinner](https://github.com/hunterae/jquery.raphael.spinner)

CSS dependencies:
- [Material icons](https://www.google.com/design/icons/)

Web service:
- [Europe PMC](https://europepmc.org/RestfulWebService)

## Usage
Using europe-pmcentralizer is easy. First you need to add a css link to the `<head>` of your HTML page for Google's material icons:
```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```
Next simply add a `<div class='pubmed'>` anywhere in your `<body>` and add the attribute `data-pubmed-ids=""` to the div tag with the PubMed IDs comma separated. Multiple pubmed div can be added to the page:
```html
<div class="pubmed" data-pubmed-ids="15057823,8091231,7581463"></div>
```
Then at the bottom of the `<body>` add your javascript dependencies:
```html
<script type="text/javascript" src="/js/bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="/js/bower_components/raphael/raphael-min.js"></script>
<script type="text/javascript" src="/js/bower_components/jquery.raphael.spinner/jquery.raphael.spinner.js"></script>
<script type="text/javascript" src="/js/bower_components/europe-pmcentralizer/europe-pmcentralizer.js"></script>
```
Finally call the `getPMCReferences()` function beneth the script dependencies:
```html
<script type="text/javascript">
  $(document).ready(function(){
    getPMCReferences({
      iconSize: '20px',
      spinnerColor: '#999'
    });
  });
</script>
```
The function has two settings that you can pass (iconSize and spinnerColor) as shown above. The iconSize is the size that you want the toggle/expand icon to be (default: 18px) and the spinnerColor is the colour you want the loading spinner to be (default: #000). To style the generated reference/citation css should be used on the generated `<div class="article">` eg.
```css
.article {
  margin-bottom: 10px
}
```
## Screenshots
*If all is well you should see a page like the screenshot below:*
![successful result](https://cloud.githubusercontent.com/assets/9589542/11246922/b51394d0-8e11-11e5-9cde-07507b3c5520.png)

*However if the request fails you get the PubMed IDs and links to Europe PMC and PubMed:*
![failed request](https://cloud.githubusercontent.com/assets/9589542/11247136/b028dede-8e12-11e5-8fbb-ca904182514b.png)
