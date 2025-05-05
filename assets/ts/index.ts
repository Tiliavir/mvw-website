class Index {
  public static initialize(): void {
      const carousels = document.querySelectorAll<HTMLElement>('.carousel');
      carousels.forEach((carousel) => {
        const ele = carousel.querySelector<HTMLUListElement>('ul')!;
        const firstSlide = ele.querySelector<HTMLLIElement>('li:nth-child(1)')!;
        const amountVisible = Math.round(ele.offsetWidth / firstSlide.offsetWidth);
        const bullets = carousel.querySelectorAll<HTMLLIElement>('ol li');
        const slides = carousel.querySelectorAll<HTMLLIElement>('ul li');
        const nextArrow = carousel.querySelector<HTMLElement>('.next')!;
        const prevArrow = carousel.querySelector<HTMLElement>('.prev')!;

        nextArrow.style.display = 'block';
        prevArrow.style.display = 'block';
        ele.scrollLeft = 0;
        bullets[0].classList.add('selected');
        slides[0].classList.add('selected');

        if (amountVisible > 1) {
          const removeEls = carousel.querySelectorAll(
              `ol li:nth-last-child(-n + ${amountVisible - 1})`
          );
          removeEls.forEach((el) => el.remove());
        }

        const setSelected = (): void => {
          bullets.forEach((b) => b.classList.remove('selected'));
          slides.forEach((s) => s.classList.remove('selected'));

          const scrollLength = slides[1].offsetLeft - slides[0].offsetLeft;
          const nth = Math.round(ele.scrollLeft / scrollLength) + 1;

          const bullet = carousel.querySelector(`ol li:nth-child(${nth})`);
          const slide = carousel.querySelector(`ul li:nth-child(${nth})`);
          bullet?.classList.add('selected');
          slide?.classList.add('selected');

          const dynamicTitle = carousel.closest('.carousel-wrapper')?.querySelector('.dynamictitle');
          if (dynamicTitle) {
            const title = slide?.querySelector('img')?.getAttribute('title');
            if (title) dynamicTitle.innerHTML = title;
          }
        };

        const scrollTo = function (this: HTMLAnchorElement, event: Event): void {
          event.preventDefault();
          const target = ele.querySelector<HTMLElement>(this.getAttribute('data-slide')!);
          if (target) ele.scrollLeft = target.offsetLeft;
        };

        const nextSlide = (): void => {
          const selected = carousel.querySelector('ol li.selected');
          if (!carousel.querySelector('ol li:last-child')?.classList.contains('selected')) {
            selected?.nextElementSibling?.querySelector('a')?.click();
          } else {
            (<HTMLAnchorElement> carousel.querySelector('ol li:first-child a'))?.click();
          }
        };

        const prevSlide = (): void => {
          const selected = carousel.querySelector('ol li.selected');
          if (!carousel.querySelector('ol li:first-child')?.classList.contains('selected')) {
            selected?.previousElementSibling?.querySelector('a')?.click();
          } else {
            (<HTMLAnchorElement> carousel.querySelector('ol li:last-child a'))?.click();
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

        bullets.forEach((bullet) => {
          bullet.querySelector('a')?.addEventListener('click', scrollTo);
          bullet.addEventListener('mousedown', setInteracted);
          bullet.addEventListener('touchstart', setInteracted);
        });

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
