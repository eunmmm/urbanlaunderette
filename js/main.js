$(function () {
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    smartphone: {
      smooth: false,
    },
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

  locoScroll.on("scroll", ScrollTrigger.update);

  var $header = $("#header");
  var $scrollBtn = $("#go_top");
  var $scrollDown = $(".scroll_down");
  var $serviceSection = document.querySelector(".sc_service");

  locoScroll.on("scroll", (args) => {
    var scrollTop = locoScroll.scroll.instance.scroll.y;

    if (scrollTop > $header.height()) {
      $header.addClass("minimize");
      $(".line").css({ background: "#111" });
    } else {
      $header.removeClass("minimize");
      $(".line").css({ background: "#fff" });
    }
  });

  $scrollBtn.on("click", function (e) {
    e.preventDefault();
    locoScroll.scrollTo(0);
  });

  $scrollDown.on("click", function (e) {
    e.preventDefault();
    locoScroll.scrollTo($serviceSection);
  });

  // nav
  t1 = gsap.timeline({
    paused: true,
  });
  t1.from(".nav_wrap .global_nav_wrap .menu a, .nav_extend p, .nav_extend li", {
    yPercent: 30,
    // stagger: 0.2,
    duration: 0.2,
    opacity: 0,
    delay: 0.8,
  });

  let count = true;
  $(".nav_btn").on("click", function (e) {
    e.preventDefault();
    if ($(this).hasClass("on")) {
      //후클릭
      $(".minimize#header .nav_btn .line").css({ background: "#111" });

      if (count == true) {
        count = false;
        $(this).removeClass("on");
        $(".login a").removeClass("on");
        t1.reverse();

        $(".nav_bg")
          .delay(500)
          .stop()
          .animate({ left: "100%" }, 1000, function () {
            $(".nav_wrap").removeClass("on");
            $(".login a").removeClass("on");
            $(".nav_bg").css({ left: "-100%" });
            count = true;
          });
      }
    } else {
      $(".minimize#header .nav_btn .line").css({ background: "#fff" });

      //첫클릭
      if (count != false) {
        $(".nav_wrap").addClass("on");
        $(".login a").addClass("on");
        $(".nav_bg").stop().animate({ left: "0" }, 1000);
        $(this).addClass("on");
        t1.restart();
      }
    }
  });

  // visual swiper

  var $visual = $(".sc_visual");
  var $state = $visual.find(".swiper_play_state");
  var $slideList = $(".visual_slider");
  var $progress = $(".swiper_progress");

  var visual_swiper = new Swiper(".visual_wrap", {
    init: false,
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
  });

  visual_swiper.on("init", function () {
    //초기세팅!
    gsap.to($(".swiper-slide-active .hide"), 1, {
      y: 0,
      opacity: 1,
      stagger: 0.2,
    });

    progress_motion();
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

    // Play, Pause
    $(".swiper_play_state").click(function (e) {
      e.preventDefault();

      if ($(this).hasClass("play")) {
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
  });

  function progress_motion() {
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

  // service swiper

  var ww = $(window).width();
  var serviceSwiper = undefined;

  function initServiceSwiper() {
    if (ww < 1024 && serviceSwiper == undefined) {
      serviceSwiper = new Swiper(".sc_service .service_wrap", {
        slidesPerView: "auto",
        simulateTouch: true,
      });
    } else if (ww >= 1024 && serviceSwiper != undefined) {
      serviceSwiper.destroy();
      serviceSwiper == undefined;
    }
  }
  initServiceSwiper();

  // miele swiper

  var swiper = new Swiper(".sc_miele .swiper-container", {
    loop: true,
    effect: "fade",
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".sc_miele .swiper-pagination",
      clickable: true,
    },
  });

  $(window).on("resize", function () {
    ww = $(window).width();
    var visualCnt = $(".visual_item h3").offset().top;

    initServiceSwiper();

    if (ww < 768) {
      $(".slider_navigation").css({
        top: visualCnt - 40,
      });
      $(".visual_state").css({
        top: visualCnt - 30,
      });
    } else {
      $(".slider_navigation, .visual_state").removeAttr("style");
    }
  });
  $(window).trigger("resize"); // 첫로드시

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  ScrollTrigger.refresh();
});
