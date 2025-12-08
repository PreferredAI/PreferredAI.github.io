import { Metadata } from "next";
import { PUBLICATIONS_DATA } from "@/data/publications";
import styles from "./publications.module.css";

export const metadata: Metadata = {
  title: "Publications - Preferred.AI",
  description: "Research papers and publications from Preferred.AI",
};

export default function PublicationsPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Read Our Papers</h2>

      {PUBLICATIONS_DATA.map((section) => (
        <div key={section.year} className={styles.yearSection}>
          <h3 className={styles.yearTitle}>{section.year}</h3>

          <ul className={styles.publicationsList}>
            {section.publications.map((pub, index) => (
              <li key={index} className={styles.publicationItem}>
                <div className={styles.pubTitle}>
                  {pub.pdfUrl ? (
                    <a
                      href={pub.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                  {pub.extraLinks && pub.extraLinks.length > 0 && (
                    <span className={styles.extraLinks}>
                      {" ("}
                      {pub.extraLinks.map((link, i) => (
                        <span key={i}>
                          {i > 0 && ", "}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.text}
                          </a>
                        </span>
                      ))}
                      {")"}
                    </span>
                  )}
                </div>

                <div className={styles.pubAuthors}>by {pub.authors}</div>

                <div className={styles.pubVenue}>{pub.venue}.</div>

                {pub.award && (
                  <div className={styles.pubAward}>
                    {pub.award.url ? (
                      <a
                        href={pub.award.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pub.award.text}
                      </a>
                    ) : (
                      <span>{pub.award.text}</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
