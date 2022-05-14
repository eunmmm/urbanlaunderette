$(function () {
  // const scrollbar = Scrollbar.init(document.querySelector("#wrapper"), {
  //   damping: 0.04,
  // });

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  locoScroll.on("scroll", (args) => {
    console.log("현위치", locoScroll.scroll.instance.scroll.y);
    //Get all current elements : args.currentElements
    if (typeof args.currentElements["hey"] === "object") {
      let progress = args.currentElements["hey"].progress;
      alert(progress);
      // ouput log example: 0.34
      // gsap example : myGsapAnimation.progress(progress);
    }

    var $window = $(window);
    var $document = $(document);
    var $header = $("#header");
    var $footer = $("#footer");
    var $scrollBtn = $("#go_top");
    var scrollTop = locoScroll.scroll.instance.scroll.y;

    $scrollBtn.on("click", function () {
      $("html, body").stop().animate(
        {
          scrollTop: 0,
        },
        600
      );
    });

    // console.log("header height", $header.height());
    // if (scrollTop > $header.height()) {
    //   $header.addClass("minimize");
    // } else {
    //   $header.removeClass("minimize");
    // }
  });

  ScrollTrigger.scrollerProxy(".container", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  // nav
  t1 = gsap.timeline({
    paused: true,
  });
  t1.from(".nav_wrap .global_nav_wrap .menu a", {
    yPercent: 30,
    // stagger: 0.2,
    duration: 0.2,
    opacity: 0,
    delay: 0.05,
  });

  let count = false;
  $(".nav_btn").click(function (e) {
    e.preventDefault();
    if (count === false) {
      $(".nav_wrap").addClass("on");
      $("body").addClass("hidden");
      $(this).addClass("on");
      gsap.to(".nav_bg", {
        duration: 0.1,
        left: 0,
        stagger: 0.1,
      });
      $(".login a").addClass("on");
      t1.play();
      count = true;
    } else if (count === true) {
      $(".nav_wrap").removeClass("on");
      $("body").removeClass("hidden");
      $(this).removeClass("on");
      t1.reverse();
      gsap.to(".nav_bg", {
        duration: 0.1,
        left: "100%",
        stagger: 0.1,
      });
      $(".login a").removeClass("on");
      count = false;
    }
  });

  //   setInterval(function () {
  //     if (didScroll && !$("body").hasClass("open_menu")) {
  //       hasScrolled();
  //       didScroll = false;
  //     }
  //   }, 50);

  // visual swiper

  var $visual = $(".sc_visual");
  var $state = $visual.find(".swiper_play_state");
  var $slideList = $(".visual_slider");
  var $progress = $(".swiper_progress");

  var visual_swiper = new Swiper(".visual_wrap", {
    init: false,
    // direction: "vertical",

    effect: "fade",
    fadeEffect: { crossFade: false },
    parallax: true,

    loop: true,
    speed: 1200,
    lazy: {
      loadOnTransitionStart: true,
    },
    navigation: {
      nextEl: ".slider_navigation .btn_next",
      prevEl: ".slider_navigation .btn_prev",
    },
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: ".sc_visual .swiper_pagination",
      type: "fraction",
      renderFraction: function (currentClass, totalClass) {
        return (
          '<span class="swiper-pagination-current">' +
          currentClass +
          "</span>" +
          '<span class="swiper_progress_hidden_space"></span>' +
          '<span class="swiper-pagination-total">' +
          totalClass +
          "</span>"
        );
      },
    },
    // on:{
    //   init:function(){
    //     alert('1');
    //   }
    // }
  });

  visual_swiper.on("init", function () {
    //초기세팅!

    gsap.to($(".swiper-slide-active .hide"), 1, {
      y: 0,
      opacity: 1,
      stagger: 0.2,
    });
  });

  visual_swiper.init();

  visual_swiper.on("slideChangeTransitionStart", function () {
    gsap.to(".swiper-slide .hide", 1, {
      y: 80,
    });

    gsap.to($(".swiper-slide-active .hide"), 1, {
      y: 0,
      opacity: 1,
      stagger: 0.2,
    });

    progress_motion();

    function progress_motion() {
      gsap.killTweensOf($progress);
      gsap.set($progress, { width: "0%" });
      gsap.to($progress, 3, {
        width: "100%",
        ease: Power0.easeIn,
        onStart: function () {
          $state.removeClass("progress_max");
        },
        onComplete: function () {
          $state.addClass("progress_max");
          if (
            $state.hasClass("play") &&
            typeof $(".visual_wrap")[0] != "undefined"
          ) {
            $(".visual_wrap")[0].swiper.slideNext();
          }
        },
      });
    }
    // Play, Pause
    $(".swiper_play_state").click(function (e) {
      e.preventDefault();

      if ($(this).hasClass("play")) {
        console.log("ff");
        visual_swiper.autoplay.stop();
        $(this).removeClass("play").addClass("pause");
        $state.find(".swiper_state_play").focus();
      } else {
        visual_swiper.autoplay.start();
        $(this).removeClass("pause").addClass("play");
        if ($(this).hasClass("progress_max")) {
          visual_swiper.slideNext();
        }
        $state.find(".swiper_state_pause").focus();
      }
    });

    // $state.on("click", function () {
    //   if ($state.hasClass("play")) {
    //     console.log("ff");
    //     visual_swiper.autoplay.stop();
    //     $state.removeClass("play").addClass("pause");
    //     // $state.find(".swiper_state_play").focus();
    //   } else {
    //     visual_swiper.autoplay.start();
    //     $state.removeClass("pause").addClass("play");
    //     if ($state.hasClass("progress_max")) {
    //       visual_swiper.slideNext();
    //     }
    //     // $state.find(".swiper_state_pause").focus();
    //   }
    // });
  });

  // space typo
  gsap.to(".typo_wrap h2", {
    scrollTrigger: {
      scroller: ".container",
      trigger: ".sc_space",
      start: "-20% bottom",
      end: "bottom top",
      scrub: 0.5,
    },
    x: "-20%",
    duration: 1,
    ease: "none",
  });

  // miele slider
  var $slider = $(".slide_wrap");
  var $slider_wrap = $(".slide_wrap").parent("div");

  if (!$slider.length) return;

  $slider.slick({
    fade: true,
    cssEase: "linear",
    speed: 500,
    autoplay: true,
    autoplaySpeed: 6000,
    infinite: true,
    arrows: false,
    dots: true,
    // pauseOnHover: false,
    // pauseOnFocus: false,
    // swipeToSlide: true,
    // dotsClass: "slider-dots",
  });

  // util

  //   function mob_util_sticky() {
  //     var $window = $(window);
  //     var $document = $(document);
  //     var $footer = $("#footer");
  //     var $scrollBtn = $(".shop, .kakao");
  //     var win_height = $window.height();

  //     if (window.screen.height === window.innerHeight) {
  //       win_height = window.screen.height;
  //     } else {
  //       win_height = window.innerHeight;
  //     }

  //     $window.on("scroll", function () {
  //       if (
  //         $window.scrollTop() <
  //         $document.height() - win_height - $footer.outerHeight()
  //       ) {
  //         $scrollBtn.addClass("util_fix");
  //       } else {
  //         $scrollBtn.removeClass("util_fix");
  //       }

  //       if ($window.scrollTop() < $window.height() / 2) {
  //         $scrollBtn.addClass("util_hide");
  //       } else {
  //         $scrollBtn.removeClass("util_hide");
  //       }
  //     });
  //   }
  //   mob_util_sticky();
});
