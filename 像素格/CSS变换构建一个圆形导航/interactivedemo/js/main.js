var steps = $('.steps'),
    wrapper = $('.cn-wrapper'),
    items = $('.cn-wrapper li'),
    anchors = $('.cn-wrapper li a'),
    reset = $('.reset-button'),
    play = $('.play-button');

var step = 1;
$('.step-button').on('click', function(e){
  e.preventDefault();
  $('.reset-button').removeAttr('disabled');
  play.attr('disabled', 'disabled');

  switch (step)
  {
      case 1: step1(); break;
      case 2: step2(); break;
      case 3: step3(); break;
      case 4: step4(); break;
      case 5: step5(); break;
      case 6: step6(); break;
      case 7: step7(); break;
  }
  step++;
  if(step > 7){
    reset.trigger('click');
    step = 1;
  }
});

function step1(){
      items.css({
        'left': '50%',
        'top': '50%',
        'margin-top': '-1.3em',
        'margin-left': '-10em',
        'overflow': 'hidden'
      });
      steps.html('移动，变换原点（右下角），以便与容器的中心一致，并隐藏其溢出');
  
  }

  function step2(){
    items.each(function(i, el){
      var angle = i * 40 - 10;
      $(this).css({
        'transform': 'rotate('+angle+'deg) skew(50deg)'
      });
    });
    steps.html('旋转项目，每一个项目都旋转。');
  }
  
  function step3(){
     anchors.css({
      'transform': 'skew(-50deg) rotate(-70deg) scale(1)',
      'border-radius': '50%',
      'text-align': 'center',
      'padding-top': '2em'
    });
    steps.html('里面的每个项目都绝对定位锚');
  }
  
  function step4(){
    wrapper.css('border-radius', '50%');
    steps.html('容器改变成圆的');
  }
  
  function step5(){
    wrapper.css('overflow', 'hidden');
    steps.html('容器的溢流是隐藏的（项目切断）');
  }
  
  function step6(){
    wrapper.css('bottom', '-13em');
     steps.html('放到容器（导航）的底部');
    reset.removeAttr('disabled');
  }

reset.on('click', function(){
  $('*').attr('style', '');
  step = 1;
  play.removeAttr('disabled');
  $('.step-button').removeAttr('disabled');
  $(this).attr('disabled', 'disabled');
  steps.html('绝对定位列表项，它们内部的锚标签也会绝对定位,它们的大小，使它们的变换结束时可见。红色圆点代表容器的中心');
});


play.on('click', function(e){
  
  e.preventDefault();
  $(this).attr('disabled', 'disabled');
  $('.step-button').attr('disabled', 'disabled');

  step1();

  setTimeout(function(){
    step2();
  }, 2000);
  
  setTimeout(function(){
    step3();
  }, 5000);
  
  setTimeout(function(){
    step4();
  }, 10000);
  
  setTimeout(function(){
   step5();
  }, 15000);
  
   setTimeout(function(){
    step6();
  }, 18000);
  
   setTimeout(function(){
    step7();
  }, 21000);
    
});

