///<jscompress sourcefile="fetch.js" />
$(document).ready(function(){
    var baseUrl = 'http://www.fudan.edu.cn';
    var MONTH_CN = {'01':'һ','02':'��','03':'��','04':'��','05':'��','06':'��','07':'��','08':'��','09':'��','10':'ʮ','11':'ʮһ','12':'ʮ��'};
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
                    var month=MONTH_CN[date.substr(5,2)]+"��";
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
    "������ѧͼ���",
    "������",
    "¿��ʫ˼"
];

var details1 = [
    "������ѧͼ���ǰ��Ϊ���������ң������缶��1918�꣩ѧ�����ʹ���ͼ�齨����1922����ʽ���ݡ�����2011��ף��ݲ�ֽ��������ԴԼ512��ᣬ������װ�ż�Լ40��ᣨ�����Ʊ�6��ᣩ�����ʱ��ͼ��10��ᡣ����������ֽ���ڿ�6491�֣���ʹ�õĵ���ͼ��195.86���֣�������ȫ�ĵ����ڿ�4.6���֣�����1����).",
    "�����ݣ�����1925�꣬ʱΪѧ���������ᡣ��սʤ���󣬶����Ľ���Ϊ����������ը�����ѵ���У�����ﺮ������������Ϊ�����ݡ�",
    " ������ע����������¿�ӵ��Ƴϡ�ʫ�˵�����һ�𹹳��ˡ�¿��ʫ˼���������⾳�������ƴ�֣����˵����ʫ˼����ŷ�ѩ�У�¿���ϡ�������Ǯ����������˵����¿�ӷ·���ʫ�����е�������Ͼ�������ʫ�˲�����Ҫ��������ʫ�˼ֵ���½�ξ�������¿���Ϲ�˼��������;�ĵ���ʹ����ʫ˼Ȫӿ����ʫʥ�Ÿ�һ����¿��ʫǧƪ�������м�������"
];
var titles2 = [
    "���ಮ",
    "лϣ��",
    "�����"
];

var details2 = [
    "���ಮ��1840��1939�� ԭ��־�£������������������������У���Ż������������յ�ͽ�ˡ�1862����Ү�ջᣬ�����ѧ��ʿѧλ��1869�����񸸡������Ϻ���㹫ѧУ����������פ��ʹ�ݲ��ޡ� 1903�괴����ѧԺ�� 1905�괴�츴����ѧ�������ȵ��θ�УУ�����ල����1907��μ���������֯�������硣193",
    "лϣ�£�1921-2000�� ����Ȫ���ˡ�1946���ҵ�����Ŵ�ѧ����ѧϵ������ѧ����������ʡ��ѧԺ��ʿѧλ��1952��10�»ع���������ѧ�ν̣������ִ������о�����������У����У����ְ��1988�����θ�����ѧ���ʡ�1979��1980�����α���Ϊȫ�������ˡ������֣���ѡΪ�й���ʮ����ʮ��������ίԱ���Ϻ��е��߽���Э��ϯ�� ",
    "��ѧ�ҡ�������ѧ���ڡ�1942��������Ϻ��У�ԭ���������ء�1965���ҵ�ڸ�����ѧ��ѧϵ��1982���ʿѧλ��2003�굱ѡΪ�й���ѧԺԺʿ��"
];

var titles3 = [
    "���߽�ѧ¥",
    "��Խ�",
    "���������ܱ���"
];

var details3 = [
    "����У�ڲ�û��һ����ѧ�С����߽�ѧ¥������1998�꣬�������Ը�����ѧ�о���֧���ŵĳ�Ա��Ȼ�߽���������������ʼ�����ǵ�����֧���ػ�֮�á�����ʮ���أ�һ�����ĸ���֧����Ա��ʼ���������ǵ��ж��ػ������ǵ����ĳ�ŵ����",
    "��Խ��ڼ䣬�о��������ѧ��������˼�����ɵ�����ٰ�һϵ��ѧ������粩ʿ��ѧ����̳���Ϻ���У�о��������ɳ��������������̳����", "���������ܱ������༭������������ʽ��Ҳ�����еĸ���У԰��ֽ�������ǴӰ�ʽ�ľ��������ŵ�רҵ���Ǵ�ÿ�ܷ��еĹ̶��뵽λ������ѧ����ͨѶ�����죬������������������һ����ʮ��"
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
        });//��ʼ��

        $focusBubble.on("click","li",function(){
            $(this).addClass("current").siblings().removeClass("current");
            _index=$(this).index();
            changeImg(_index);
        });//����ֻ�

        $nextBnt.on("click",function(){
            _index++
            if(_index>bannerLength-1){
                _index=0;
            }
            changeImg(_index);
        });//��һ��

        $prevBnt.on("click",function(){
            _index--
            if(_index<0){
                _index=bannerLength-1;
            }
            changeImg(_index);
        });//��һ��

        function changeImg(_index){
            $bannerList.eq(_index).fadeIn(250);
            $bannerList.eq(_index).siblings().fadeOut(200);
            $focusBubble.find("li").removeClass("current");
            $focusBubble.find("li").eq(_index).addClass("current");
            clearInterval(_timer);
            _timer=setInterval(function(){$nextBnt.click()},10000)
        }//�л�������
        _timer=setInterval(function(){$nextBnt.click()},10000)
    }();
})/**
 * Created by Administrator on 2016/10/21.
 */
