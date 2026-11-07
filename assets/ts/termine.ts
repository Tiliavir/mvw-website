class Appointments {
  public static initialize(): void {
    const cutOffDate = Appointments.addDays(new Date(), -3);

    document.querySelectorAll('meta[itemprop="startDate"]').forEach((e) => {
      let el = e as HTMLElement;
      const endDateEl = el.parentElement?.querySelector<HTMLElement>('meta[itemprop="endDate"]');
      el = endDateEl ?? el;
      const content = el.getAttribute("content");
      if (!content) {
        return;
      }
      const endDate = new Date(content);
      if (endDate < cutOffDate) {
        const event = el.closest<HTMLElement>("[itemtype='http://schema.org/Event']");
        if (event) {
          event.hidden = true;
        }
      }
    });

    document.querySelectorAll<HTMLElement>("[data-limit]").forEach((list) => {
      const limit = Number.parseInt(list.dataset.limit ?? "0", 10);
      const upcoming = Array.from(list.querySelectorAll<HTMLElement>("[itemtype='http://schema.org/Event']")).filter(
        (event) => !event.hidden,
      );
      upcoming.slice(limit).forEach((event) => {
        event.hidden = true;
      });
    });

    document.querySelectorAll("main h2").forEach((e) => {
      const next = e.nextElementSibling as HTMLElement | null;
      if (next?.tagName === "TABLE" && next.offsetHeight === 0) {
        (e as HTMLElement).style.display = "none";
      }
    });
  }

  private static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

document.addEventListener("DOMContentLoaded", () => Appointments.initialize());
