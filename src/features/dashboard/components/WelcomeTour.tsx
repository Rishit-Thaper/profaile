"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_KEY = "profaile-onboarding-tour-v1";

export function WelcomeTour({ manual = false }: { manual?: boolean }) {
  useEffect(() => {
    if (localStorage.getItem(TOUR_KEY)) return;
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    if (mobile && !manual) return;

    const tour = driver({
      popoverClass: "profaile-tour",
      overlayColor: "#070c19",
      overlayOpacity: 0.6,
      showProgress: false,
      nextBtnText: "Next",
      doneBtnText: "Done",
      steps: [
        {
          element: mobile ? undefined : '[data-tour="portfolio-card"]',
          popover: {
            showButtons: ["next", "close"],
            title: "Your ProfAIle card",
            description: "Style your card, edit its headline, and share it once your portfolio is live.",
            side: mobile ? undefined : "bottom",
          },
        },
        {
          element: mobile ? undefined : '[data-tour="manage-portfolios"]',
          popover: {
            title: "Manage portfolios",
            description: "Open this workspace to edit your draft, review versions, and go live.",
            side: mobile ? undefined : "bottom",
            align: "center",
          },
        },
      ],
      onDestroyed: (_element, _step, { reason }) => {
        if (reason === "done" || reason === "close" || reason === "escape" || reason === "overlay") {
          localStorage.setItem(TOUR_KEY, "complete");
        }
      },
    });

    tour.drive();
    return () => tour.destroy();
  }, [manual]);

  return null;
}
