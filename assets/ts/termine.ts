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
        const tr = el.closest("tr") as HTMLElement;
        if (tr) {
          tr.style.display = "none";
        }
      }
    });

    document.querySelectorAll("main h2").forEach((e) => {
      const next = e.nextElementSibling as HTMLElement | null;
      if (next && next.tagName === "TABLE" && next.offsetHeight === 0) {
        (e as HTMLElement).style.display = "none";
      }
    });
  }

  private static addDays(date: Date, days: number): Date {
    const result = new Date(date.getTime());
    result.setDate(result.getDate() + days);
    return result;
  }
}

document.addEventListener("DOMContentLoaded", () => Appointments.initialize());
