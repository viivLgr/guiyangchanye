///<jscompress sourcefile="fetch.js" />
$(document).ready(function(){
    var baseUrl = 'http://www.fudan.edu.cn';
    var MONTH_CN = {'01':'一','02':'二','03':'三','04':'四','05':'五','06':'六','07':'七','08':'八','09':'九','10':'十','11':'十一','12':'十二'};
    var news_xml_1,news_xml_2;
    var news_xml_p;

    function cutoff(title,len) {
        if (title.length>len)
            return title.substr(0,len)+'...';
        else
            return title;
    }

    var conf = [
        {"pageNum":"1",
            "function":function(result){
                news_xml_1=result;
                news_xml_p=1;
                var data_list=$(result).find('channel').find('item');
                var nodei=data_list.first();
                $('#news-fig img').attr('src',nodei.find('enclosure').attr('url'));
                $('#news-fig a').attr('href',nodei.find('link').text());
                $("#rss-news .panel-body .caption .content-title a").html(cutoff(nodei.find('title').text(),42));
                $("#rss-news .panel-body .caption .content-title a").attr('href',nodei.find('link').text());
                $("#rss-news .panel-body .caption .content-detail").html(cutoff(nodei.find('description').text(),50));
                $("#special-time").html(nodei.find('pubDate').text())
            }},
        {"pageNum":"2",
            "function":function(result){
                news_xml_2=result;
                var data_list=$(result).find('channel').find('item');
                var nodei=data_list.first();
                $("#rss-news .panel-body .post-padding .content-title a").each(function(i){
                    $(this).html(cutoff(nodei.find('title').text(),28));
                    $(this).attr('href',nodei.find('link').text());
                    nodei=nodei.next();
                });

                var nodei=data_list.first();
                $("#rss-news .panel-body .post-padding .content-detail").each(function(i){
                    $(this).html(cutoff(nodei.find('description').text(),36));
                    nodei=nodei.next();
                });

                var nodei=data_list.first();
                $("#rss-news .panel-body .post-padding .content-time").each(function(i){
                    $(this).html(nodei.find('pubDate').text());
                    nodei=nodei.next();
                });
            }},
        {"pageNum":"30000",
            "function":function(result){
                var data_list=$(result).find('channel').find('item');
                var nodei=data_list.first();
                $("#rss-events .panel-body .lined-title a").each(function(i){
                    $(this).html(cutoff(nodei.find('title').text(),24));
                    $(this).attr('href',nodei.find('link').text());
                    nodei=nodei.next();
                });

                var nodei=data_list.first();
                $("#rss-events .panel-body .event-location-address").each(function(i){
                    $(this).html(nodei.find('place').text());
                    nodei=nodei.next();
                });

                var nodei=data_list.first();
                $("#rss-events .panel-body .event-time").each(function(i){
                    $(this).html(nodei.find('pubDate').text().substr(-8,5));
                    nodei=nodei.next();
                });

                var nodei=data_list.first();
                $("#rss-events .panel-body .event-date").each(function(i){
                    var date=nodei.find('pubDate').text();
                    var month=MONTH_CN[date.substr(5,2)]+"月";
                    var day=date.substr(8,2);
                    // alert($(this).html());
                    $(this).find(".event-month").html(month);
                    $(this).find(".event-day").html(day);
                    nodei=nodei.next();
                });

            }},
        {"pageNum":"20000",
            "function":function(result){
                var data_list=$(result).find('channel').find('item');
                var nodei=data_list.first();
                $("#rss-notices .panel-body .content-title a").each(function(i){
                    $(this).html(cutoff(nodei.find('title').text(),30));
                    $(this).attr('href',nodei.find('link').text())
                    nodei=nodei.next();
                });

                var nodei=data_list.first();
                $("#rss-notices .panel-body .content-detail").each(function(i){
                    $(this).html(cutoff(nodei.find('description').text(),42));
                    nodei=nodei.next();
                });

                var nodei=data_list.first();
                $("#rss-notices .panel-body .content-time").each(function(i){
                    $(this).html(nodei.find('pubDate').text().substr(0,10));
                    nodei=nodei.next();
                });
            }}
    ];

    function parseFetchedData(pageNum, processFunc){
        if (pageNum<7)
            $.get("../xml/tagid"+pageNum+".xml", processFunc);
        else
            $.get("../xml/catid"+pageNum+".xml", processFunc);
        //$.get("rss"+pageNum, processFunc);
    }

    $.each(conf, function(index, value){
        parseFetchedData(value["pageNum"], value["function"]);
    });

    // $.get(baseUrl+"/weibo.txt", function(result){
    $.get("weibo.txt", function(result){
        var s=result.split('\n\n');
        var i=0;
        while (i<2 && s[2*i+1].length<20)
            i++;
        $('#weibo-content').html(s[2*i+1]);
        $('#weibo-time').html(s[2*i]);
    },"text");
    // $.get(baseUrl+"/weixin.txt", function(result){
    $.get("weixin.txt", function(result){
        var s=result.split('\n\n');
        $('#weixin-title').html(cutoff(s[0],15));
        $('#weixin-content').html(s[1]);
        $('#weixin-time').html(s[2]);
    },"text");

    $('#news-change').click(function(){
        // alert(news_xml_p);

        var data_list=$(news_xml_1).find('channel').find('item');
        var nodei=data_list.first();
        for (var i=0;i<news_xml_p;i++)
            nodei=nodei.next();
        $('#news-fig img').attr('src',nodei.find('enclosure').attr('url'));
        $('#news-fig a').attr('href',nodei.find('link').text());
        $("#rss-news .panel-body .caption .content-title a").html(cutoff(nodei.find('title').text(),42));
        $("#rss-news .panel-body .caption .content-title a").attr('href',nodei.find('link').text());
        $("#rss-news .panel-body .caption .content-detail").html(cutoff(nodei.find('description').text(),50));
        $("#special-time").html(nodei.find('pubDate').text())

        data_list=$(news_xml_2).find('channel').find('item');
        nodei=data_list.first();
        for (var i=0;i<3*news_xml_p;i++)
            nodei=nodei.next();
        var first_node=nodei;
        $("#rss-news .panel-body .post-padding .content-title a").each(function(i){
            $(this).html(cutoff(nodei.find('title').text(),28));
            $(this).attr('href',nodei.find('link').text());
            nodei=nodei.next();
        });

        var nodei=first_node;
        $("#rss-news .panel-body .post-padding .content-detail").each(function(i){
            $(this).html(cutoff(nodei.find('description').text(),36));
            nodei=nodei.next();
        });

        var nodei=first_node;
        $("#rss-news .panel-body .post-padding .content-time").each(function(i){
            $(this).html(nodei.find('pubDate').text());
            nodei=nodei.next();
        });

        news_xml_p+=1;
        if (news_xml_p==3)
            news_xml_p=0;
    });
})

///<jscompress sourcefile="custom1.js" />
$(window).scroll(function(){
    var scrollTop = document.body.scrollTop > document.documentElement.scrollTop ?  document.body.scrollTop : document.documentElement.scrollTop;
    var clientHeight = document.documentElement.clientHeight;

    if(scrollTop> 900){
        $('#normal_header').css({
            display: 'block'
        });

    }else{
        $('#normal_header').css({
            display: 'none'
        });
    }
});

var fs = 0;
$('.ct1-search').click(function() {
    if (fs == 0) {
        $('.ct1-searchbox').css({
            display: 'block'
        });
        fs = 1;
        $('.ct1-searchbox').focus();
    } else {
        $('.ct1-searchbox').css({
            display: 'none'
        });
        fs = 0;
    }
});

$(function() {



    $('.ct1-searchbox').blur(function() {
        $(this).css({display:'none'});
        fs = 0;
    });

    var flag = 0;
    $('.ct1-headermenu-logo').click(function() {
        if (flag == 0) {
            $('.ct1-miniheader-menu').stop().animate({
                right: 0 + 'px'
            }, 300);
            flag = 1;
        } else {
            $('.ct1-miniheader-menu').stop().animate({
                right: -110 + 'px'
            }, 300);
            flag = 0;
        }
    });

    for (var i = 0; i != 3; i++) {
        $('.ct1-miniheader-menu>li>a').eq(i).click(function() {
            if ($(this).parent().children('ul').css('display') == 'none') {
                $(this).parent().siblings().children('ul').css({
                    display: 'none'
                });
                $(this).parent().children('ul').css({
                    display: 'block'
                });
            } else {
                $(this).parent().children('ul').css({
                    display: 'none'
                });

            }
        });
    }

    for (var i = 0; i != 6; i++) {
        $('.ct1-miniheader-menu2>li').eq(i).click(function() {
            if ($(this).children('ul').css('display') == 'none') {
                $(this).siblings().children('ul').css({
                    display: 'none'
                });
                $(this).children('ul').css({
                    display: 'block'
                });
            } else {
                $(this).children('ul').css({
                    display: 'none'
                });

            }
        });
    }

    $(".ct1-menu2 li").on("mouseover", function(e){
        $(this).children('ul').css("display","block")
    });

    $(".ct1-menu2 li").on("mouseout", function(e){
        $(this).children('ul').css("display","none")
    });


        $('.ct1-menu2>li').eq(i).on("click", function(e){
            e.stopPropagation();
        });
        /*$('.ct1-menu2>li').eq(i).click(function() {
         if ($(this).children('ul').css('display') == 'none') {
         $(this).siblings().css({
         backgroundImage: ''
         });
         $(this).siblings().children('ul').css({
         display: 'none'
         });
         $(this).css({
         backgroundImage: 'url(images/ct1-menu1.png)'
         });
         $(this).children('ul').css({
         display: 'block'
         });
         } else {
         $(this).css({
         backgroundImage: ''
         });
         $(this).children('ul').css({
         display: 'none'
         });
         }
         });*/
    }


});

///<jscompress sourcefile="custom2.js" />
var titles1 = [
    "复旦大学图书馆",
    "寒冰馆",
    "驴背诗思"
];

var details1 = [
    "复旦大学图书馆前身为戊午阅览室，由戊午级（1918年）学生集资购置图书建立，1922年正式建馆。截至2011年底，馆藏纸本文献资源约512万册，其中线装古籍约40万册（包括善本6万册），民国时期图书10万册。订购中西文纸质期刊6491种，可使用的电子图书195.86万种，中西文全文电子期刊4.6万种（中文1万种).",
    "寒冰馆，建于1925年，时为学生第四宿舍。抗战胜利后，顶部改建。为纪念重庆大轰炸中遇难的我校教务长孙寒冰先生，更名为寒冰馆。",
    " 当我们注视着这塑像，驴子的笃诚、诗人的忧郁一起构成了“驴背诗思”的深遂意境。正如唐代郑启所说：“诗思在灞桥风雪中，驴背上”，又如钱钟书先生所说：“驴子仿佛是诗人特有的坐骑。”毕竟真正的诗人并不需要骏马的张扬。诗人贾岛、陆游经常骑在驴背上构思，正是行途的颠簸使他们诗思泉涌。而诗圣杜甫一生骑驴做诗千篇，字里行间满怀着"
];
var titles2 = [
    "马相伯",
    "谢希德",
    "洪家兴"
];

var details2 = [
    "马相伯（1840—1939） 原名志德，又名建常，改名良，以字行，晚号华封先生，江苏丹徒人。1862年入耶稣会，后获神学博士学位。1869年升神父。曾任上海徐汇公学校长、清政府驻日使馆参赞。 1903年创办震旦学院。 1905年创办复旦公学，并两度担任该校校长（监督）。1907年参加梁启超组织的政闻社。193",
    "谢希德（1921-2000） 福建泉州人。1946年毕业于厦门大学数理学系。后留学美国，获麻省理工学院博士学位。1952年10月回国到复旦大学任教，历任现代物理研究所所长、副校长、校长等职，1988年起任复旦大学顾问。1979、1980年两次被评为全国“三八”红旗手，当选为中共第十二、十三届中央委员，上海市第七届政协主席。 ",
    "数学家。复旦大学教授。1942年出生于上海市，原籍江苏吴县。1965年毕业于复旦大学数学系，1982年获博士学位。2003年当选为中国科学院院士。"
];

var titles3 = [
    "第七教学楼",
    "相辉节",
    "《复旦人周报》"
];

var details3 = [
    "复旦校内并没有一栋教学叫“第七教学楼”。从1998年，五名来自复旦大学研究生支教团的成员悄然走进了宁夏西吉，开始了他们的西部支教拓荒之旅。历经十数载，一批批的复旦支教团员们始终在用他们的行动守护着他们当初的承诺……",
    "相辉节期间，研究生会秉承学术独立、思想自由的理念，举办一系列学术活动，如博士生学术论坛、上海高校研究生“相辉沙龙”、“才智论坛”等", "《复旦人周报》，编辑制作发行最正式化也最亲切的复旦校园报纸，无论是从版式的精美、新闻的专业还是从每周发行的固定与到位来看。学生会通讯社主办，至今已历经五年出版过一百五十期"
];

var img1 =[
    "images/tushuguan.jpg",
    "images/hanbingguan.jpg",
    "images/lvbei.jpg"
];
var img2 =[
    "images/maxiangbo.jpg",
    "images/xiexide.jpg",
    "images/hongjiaxing.jpg"
];
var img3 =[
    "images/7jiao.jpg",
    "images/xianghuijie.jpg",
    "images/zhoubao.jpg"
];
var a1 =[
    "http://www.fudan.edu.cn/entries/view/2464/",
    "http://www.fudan.edu.cn/entries/view/2407",
    "http://www.fudan.edu.cn/entries/view/2171"
];
var a2 =[
    "http://www.fudan.edu.cn/entries/view/474",
    "http://www.fudan.edu.cn/entries/view/1981",
    "http://www.fudan.edu.cn/entries/view/453"
];
var a3 =[
    "http://www.fudan.edu.cn/entries/view/2521",
    "http://www.fudan.edu.cn/entries/view/998",
    "http://www.fudan.edu.cn/entries/view/43"
];



function getFudan_building(){
    //$("fudanTab0").css("background","../images/fudan_building.png");
    //$("fudanTab1").css("background","../images/fudan_person_white.png");
    //$("fudanTab2").css("background","../images/fudan_story_white.png");
    var building = document.getElementById("fudanTab0");
    building.style.background = "url('images/fudan_building.png')";
    var person = document.getElementById("fudanTab1");
    person.style.background = "url('images/fudan_person_white.png')";
    var story = document.getElementById("fudanTab2");
    story.style.background = "url('images/fudan_story_white.png')";
    var title = new Array();
    title[0] = document.getElementById("fudanWikiTitle0");
    title[1] = document.getElementById("fudanWikiTitle1");
    title[2] = document.getElementById("fudanWikiTitle2");
    var detail = new Array();
    detail[0] = document.getElementById("fudanWikiDetail0");
    detail[1] = document.getElementById("fudanWikiDetail1");
    detail[2] = document.getElementById("fudanWikiDetail2");
    var imgl = new Array();
    imgl[0] = document.getElementById("fudanWikiImg0");
    imgl[1] = document.getElementById("fudanWikiImg1");
    imgl[2] = document.getElementById("fudanWikiImg2");
    var a = new Array();
    a[0] = document.getElementById("fudanWikia00");
    a[1] = document.getElementById("fudanWikia11");
    a[2] = document.getElementById("fudanWikia22");
    var aa = new Array();
    aa[0] = document.getElementById("fudanWikia0");
    aa[1] = document.getElementById("fudanWikia1");
    aa[2] = document.getElementById("fudanWikia2");
    for(var i = 0; i < 3; i++){
        title[i].innerHTML = titles1[i];
        detail[i].innerHTML = details1[i];
        imgl[i].src = img1[i];
        a[i].href=a1[i];
        aa[i].href=a1[i];


    }
}


function getFudan_person(){
    //$("fudanTab0").css("background","../images/fudan_building_white.png");
    //$("fudanTab1").css("background","../images/fudan_person.png");
    //$("fudanTab2").css("background","../images/fudan_story_white.png");
    var building = document.getElementById("fudanTab0");
    building.style.background = "url('images/fudan_building_white.png')";
    var person = document.getElementById("fudanTab1");
    person.style.background = "url('images/fudan_person.png')";
    var story = document.getElementById("fudanTab2");
    story.style.background = "url('images/fudan_story_white.png')";
    var title = new Array();
    title[0] = document.getElementById("fudanWikiTitle0");
    title[1] = document.getElementById("fudanWikiTitle1");
    title[2] = document.getElementById("fudanWikiTitle2");
    var detail = new Array();
    detail[0] = document.getElementById("fudanWikiDetail0");
    detail[1] = document.getElementById("fudanWikiDetail1");
    detail[2] = document.getElementById("fudanWikiDetail2");
    var imgl = new Array();
    imgl[0] = document.getElementById("fudanWikiImg0");
    imgl[1] = document.getElementById("fudanWikiImg1");
    imgl[2] = document.getElementById("fudanWikiImg2");
    var a = new Array();
    a[0] = document.getElementById("fudanWikia00");
    a[1] = document.getElementById("fudanWikia11");
    a[2] = document.getElementById("fudanWikia22");
    var aa = new Array();
    aa[0] = document.getElementById("fudanWikia0");
    aa[1] = document.getElementById("fudanWikia1");
    aa[2] = document.getElementById("fudanWikia2");
    for(var i = 0; i < 3; i++){
        title[i].innerHTML = titles2[i];
        detail[i].innerHTML = details2[i];
        imgl[i].src = img2[i];
        a[i].href=a2[i];
        aa[i].href=a2[i];
    }
}

function getFudan_story(){
    //$("fudanTab0").css("background","../images/fudan_building_white.png");
    //$("fudanTab1").css("background","../images/fudan_person_white.png");
    //$("fudanTab2").css("background","../images/fudan_story.png");
    var building = document.getElementById("fudanTab0");
    building.style.background = "url('images/fudan_building_white.png')";
    var person = document.getElementById("fudanTab1");
    person.style.background = "url('images/fudan_person_white.png')";
    var story = document.getElementById("fudanTab2");
    story.style.background = "url('images/fudan_story.png')";
    var title = new Array();
    title[0] = document.getElementById("fudanWikiTitle0");
    title[1] = document.getElementById("fudanWikiTitle1");
    title[2] = document.getElementById("fudanWikiTitle2");
    var detail = new Array();
    detail[0] = document.getElementById("fudanWikiDetail0");
    detail[1] = document.getElementById("fudanWikiDetail1");
    detail[2] = document.getElementById("fudanWikiDetail2");
    var imgl = new Array();
    imgl[0] = document.getElementById("fudanWikiImg0");
    imgl[1] = document.getElementById("fudanWikiImg1");
    imgl[2] = document.getElementById("fudanWikiImg2");
    var a = new Array();
    a[0] = document.getElementById("fudanWikia00");
    a[1] = document.getElementById("fudanWikia11");
    a[2] = document.getElementById("fudanWikia22");
    var aa = new Array();
    aa[0] = document.getElementById("fudanWikia0");
    aa[1] = document.getElementById("fudanWikia1");
    aa[2] = document.getElementById("fudanWikia2");
    for(var i = 0; i < 3; i++){
        title[i].innerHTML = titles3[i];
        detail[i].innerHTML = details3[i];
        imgl[i].src = img3[i];
        a[i].href=a3[i];
        aa[i].href=a3[i];
    }
}
///<jscompress sourcefile="custom3.js" />
(function(){
    $('.animated').click(function(){
        window.location.href=$(this).attr('href');

    });


    $('.img-container').mouseover(function(){
        var desc_container = $(this).children('.desc-container');


        $(desc_container).css({
            'display':'none'

        });

        var h = $(this).children('.animated');
        var wrap = $(h).children('div.wrapper');

        var wid_wrap = $(this).children('.desc-container').width();
        var wid_con = $(this).width();
        var hei_con = $(this).height();
        var hei_wrap = $(this).children('.desc-container').height();


        $(wrap).css({
            'left':(wid_con-wid_wrap)/2+"px",
            'top':(hei_con - hei_wrap )/2+"px",
        });
        $(h).css({
            'display':'block',

        })
    });
    $('.img-container').mouseout(function(){
        var h = $(this).children('.animated');
        $(h).css({
            'display':'none',

        })
        var desc_container = $(this).children('.desc-container');


        $(desc_container).css({
            'display':'block',

        });




    });
    var ratio = 1.0;
    var imgSrc = $('#tag-image').attr('src');
    getRatio(imgSrc,function(w,h){
        ratio = w / h;

    });
    $(window).resize(function(){
        if($(window).width()>768){



            var img_container = $('.gallery > .img-col');

            var wi = $(img_container).width();


            $('.gallery .img-col').css({
                'height':Math.floor(wi/ratio)+"px",


            });

        }


        /*
         var img_col2 = $('.gallery > .img-col .col2 img');
         $(img_col2).css({
         'height':Math.floor(wi/ratio/2.0)+"px",
         'width':'100%'

         });*/

    });
    function getRatio(url,callback){
        var img = new Image();
        img.src = url;
        if(img.complete){
            callback(img.width,img.height);
        }else{
            img.onload = function(){
                callback(img.width,img.height);
            }
        }
    }

})();
///<jscompress sourcefile="adjustVideo.js" />
$(function() {


    var text;

    var screenWidth = $(window).width();
    if (screenWidth > 1160 && screenWidth < 1200 && $('.ct1-miniheader-menu>li').length == 3) {
        text = $('.ct1-miniheader-menu>li').eq(2).html();
        //$('.ct1-miniheader-menu>li').eq(2).remove();
        $('.ct1-miniheader-menu>li').eq(2).css('display','none');
    }

    $(window).resize(function() {
        //alert("resize");
        var screenWidth = $(window).width();
        if (screenWidth > 1160 && screenWidth < 1200 && $('.ct1-miniheader-menu>li').length == 3) {
            text = $('.ct1-miniheader-menu>li').eq(2).html();
            //$('.ct1-miniheader-menu>li').eq(2).remove();
            $('.ct1-miniheader-menu>li').eq(2).css('display','none');
        }
        if (screenWidth < 1160) {
            //$('.ct1-miniheader-menu').append(text);
            $('.ct1-miniheader-menu>li').eq(2).css('display','block');
        }
        var videoHeight =642;
        $("#div2").height(videoHeight + 'px');
        var menuTop = (videoHeight - 456) / 2;
        $(".ct1-menu1").css("top", menuTop + 'px');


    });
});

///<jscompress sourcefile="custom4.js" />
$(function(){
    var _width=$("#focus-banner-list img").width();
    var _width1=$("#focus-banner-list img").height();
    var _height1=642;

    var nowwidth=_width/(_width1/_height1);
    var width_win= $(window).width();
    $("#focus-banner-list img").css("left",function(){return -(nowwidth-width_win)/2;});

    var focusBanner=function(){
        var $focusBanner=$("#focus-banner"),
            $bannerList=$("#focus-banner-list li"),
            $focusHandle=$(".focus-handle"),
            $bannerImg=$(".focus-banner-img"),
            $bannerImg1=$(".focus-banner-img img"),
            $nextBnt=$("#prev-img"),
            $prevBnt=$("#next-img"),
            $focusBubble=$("#focus-bubble"),
            bannerLength=$bannerList.length,
            _index=0,
            _timer="";

        //var _height=$(".focus-banner-img").find("img").height();

        var _height=642;
        $focusBanner.height(_height);
        $bannerImg.height(_height);
        $bannerImg1.height(_height);

        $(window).resize(function(){
            var _width=1920;

            var _height1=642;
            $focusBanner.height(_height1);
            $bannerImg.height(_height1);
            $bannerImg1.height(_height1);
            var _width1=$("#focus-banner-list img").height();
            var nowwidth=_width/(_width1/_height1);
            //alert(_width + "-" + _width1 + "-" + _height1);
            var width_win= $(window).width();

            $("#focus-banner-list img").css("left",function(){return -(nowwidth-width_win)/2;});
            //alert(nowwidth + "-" + width_win + "-" + _height1);
        });

        for(var i=0; i<bannerLength; i++){
            $bannerList.eq(i).css("zIndex",bannerLength-i);
            $focusBubble.append("<li></li>");
        }
        $focusBubble.find("li").eq(0).addClass("current");
        var bubbleLength=$focusBubble.find("li").length;
        $focusBubble.css({
            "width":bubbleLength*22,
            "marginLeft":-bubbleLength*11
        });//初始化

        $focusBubble.on("click","li",function(){
            $(this).addClass("current").siblings().removeClass("current");
            _index=$(this).index();
            changeImg(_index);
        });//点击轮换

        $nextBnt.on("click",function(){
            _index++
            if(_index>bannerLength-1){
                _index=0;
            }
            changeImg(_index);
        });//下一张

        $prevBnt.on("click",function(){
            _index--
            if(_index<0){
                _index=bannerLength-1;
            }
            changeImg(_index);
        });//上一张

        function changeImg(_index){
            $bannerList.eq(_index).fadeIn(250);
            $bannerList.eq(_index).siblings().fadeOut(200);
            $focusBubble.find("li").removeClass("current");
            $focusBubble.find("li").eq(_index).addClass("current");
            clearInterval(_timer);
            _timer=setInterval(function(){$nextBnt.click()},10000)
        }//切换主函数
        _timer=setInterval(function(){$nextBnt.click()},10000)
    }();
})/**
 * Created by Administrator on 2016/10/21.
 */
