"use client";

import { useState } from "react";
import styles from "./faq.module.css";
import type { FaqItem } from "@/lib/kokurikuler";
import { ChevronDown } from "lucide-react";

interface Props {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
        FAQ belum tersedia.
      </p>
    );
  }

  return (
    <div className={styles.faqList} role="list">
      {faqs.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
            role="listitem"
          >
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${idx}`}
              id={`faq-question-${idx}`}
            >
              <span>{item.pertanyaan}</span>
              <ChevronDown
                size={20}
                className={styles.faqChevron}
                aria-hidden="true"
              />
            </button>
            <div
              id={`faq-answer-${idx}`}
              role="region"
              aria-labelledby={`faq-question-${idx}`}
              className={styles.faqAnswer}
              style={{
                maxHeight: isOpen ? "400px" : "0px",
              }}
            >
              <div className={styles.faqAnswerInner}>{item.jawaban}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
