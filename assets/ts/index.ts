class Index {
  public static initialize(): void {
      const carousels = document.querySelectorAll<HTMLElement>('.carousel');
      carousels.forEach((carousel) => {
        const ele = carousel.querySelector<HTMLUListElement>('ul')!;
        const firstSlide = ele.querySelector<HTMLLIElement>('li:nth-child(1)')!;
        const amountVisible = Math.round(ele.offsetWidth / firstSlide.offsetWidth);
        const slides = carousel.querySelectorAll<HTMLLIElement>('ul li');
        const nextArrow = carousel.querySelector<HTMLElement>('.next')!;
        const prevArrow = carousel.querySelector<HTMLElement>('.prev')!;

        nextArrow.style.display = 'block';
        prevArrow.style.display = 'block';
        ele.scrollLeft = 0;
        slides[0].classList.add('selected');

        if (amountVisible > 1) {
          const removeEls = carousel.querySelectorAll(
              `ul li:nth-last-child(-n + ${amountVisible - 1})`
          );
          removeEls.forEach((el) => el.remove());
        }

        const setSelected = (): void => {
          slides.forEach((s) => s.classList.remove('selected'));

          const scrollLength = slides[1].offsetLeft - slides[0].offsetLeft;
          const nth = Math.round(ele.scrollLeft / scrollLength) + 1;

          const slide = carousel.querySelector(`ul li:nth-child(${nth})`);
          slide?.classList.add('selected');
        };

        const nextSlide = (): void => {
          const scrollLength = slides[1].offsetLeft - slides[0].offsetLeft;
          const maxScrollLeft = ele.scrollWidth - ele.clientWidth;

          if (ele.scrollLeft + scrollLength <= maxScrollLeft) {
            ele.scrollBy({ left: scrollLength, behavior: 'smooth' });
          } else {
            // Loop to first
            ele.scrollTo({ left: 0, behavior: 'smooth' });
          }
        };

        const prevSlide = (): void => {
          const scrollLength = slides[1].offsetLeft - slides[0].offsetLeft;

          if (ele.scrollLeft - scrollLength >= 0) {
            ele.scrollBy({ left: -scrollLength, behavior: 'smooth' });
          } else {
            // Loop to last
            ele.scrollTo({ left: ele.scrollWidth, behavior: 'smooth' });
          }
        };


        const setInteracted = (): void => {
          ele.classList.add('interacted');
        };

        ele.addEventListener('scroll', debounce(setSelected));
        ele.addEventListener('touchstart', setInteracted);
        ele.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            ele.classList.add('interacted');
          }
        });

        nextArrow.addEventListener('click', nextSlide);
        nextArrow.addEventListener('mousedown', setInteracted);
        nextArrow.addEventListener('touchstart', setInteracted);

        prevArrow.addEventListener('click', prevSlide);
        prevArrow.addEventListener('mousedown', setInteracted);
        prevArrow.addEventListener('touchstart', setInteracted);

        const duration = parseInt(carousel.getAttribute('data-duration') || '0');
        if (duration > 0) {
          setInterval(() => {
            if (
                ele !== document.querySelector('.carousel:hover ul') &&
                !ele.classList.contains('interacted')
            ) {
              nextArrow.click();
            }
          }, duration);
        }
      });
  }
}

// Debounce helper
function debounce(fn: Function): () => void {
  let timeout: number;
  return function (this: any, ...args: any[]) {
    if (timeout) window.cancelAnimationFrame(timeout);
    timeout = window.requestAnimationFrame(() => fn.apply(this, args));
  };
}

$(() => {
  Index.initialize();
});
