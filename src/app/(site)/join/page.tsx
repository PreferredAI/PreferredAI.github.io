import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Join Preferred.AI - We are growing, and always on the lookout for bright, dedicated, and nice individuals to become a part of us.",
};

const reasons = [
  {
    num: "01",
    title: "We publish",
    text: (
      <>
        We hold ourselves to a high standard. Our{" "}
        <Link
          href="/publications"
          className="font-medium text-foreground underline underline-offset-4 decoration-border/80 hover:text-primary hover:decoration-primary transition-colors"
        >
          publications
        </Link>{" "}
        appear in top-tier venues (including IJCAI-PRICAI 2020 Distinguished
        Paper and AAAI 2014 Honorable Mention). You will aim high.
      </>
    ),
  },
  {
    num: "02",
    title: "We achieve",
    text: (
      <>
        Our PhD candidates have been winning{" "}
        <a
          href="https://graduatestudies.smu.edu.sg/phd/research-achievements/presidential-doctoral-fellowship"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4 decoration-border/80 hover:text-primary hover:decoration-primary transition-colors"
        >
          SMU Presidential Doctoral Fellowships
        </a>{" "}
        for nine years running. You will get things done.
      </>
    ),
  },
  {
    num: "03",
    title: "We seek impact",
    text: (
      <>
        We develop open-source frameworks like{" "}
        <a
          href="https://github.com/PreferredAI/cornac"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4 decoration-border/80 hover:text-primary hover:decoration-primary transition-colors"
        >
          Cornac
        </a>
        , teach tutorials, and present at premier international conferences. You
        will matter.
      </>
    ),
  },
  {
    num: "04",
    title: "We are equipped",
    text: "We have dedicated GPU compute servers, large-scale benchmarks, and rich datasets. You will have what you need to pursue high-quality research.",
  },
  {
    num: "05",
    title: "We are diverse",
    text: "Our members come from across the globe: Singapore, Indonesia, Vietnam, China, Russia, France, Algeria, Greece, Philippines, Sri Lanka, and beyond. You will fit in.",
  },
  {
    num: "06",
    title: "We are up-and-coming",
    text: (
      <>
        <a
          href="https://csrankings.org/#/index?ai&vision&mlmining&nlp&inforet&world"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4 decoration-border/80 hover:text-primary hover:decoration-primary transition-colors"
        >
          CSRankings.org
        </a>{" "}
        places SMU among the top 30 institutions worldwide for AI/Data Mining
        (including KDD). You will grow along with us.
      </>
    ),
  },
  {
    num: "07",
    title: "We plan ahead",
    text: (
      <>
        Our graduates go on to academic and industry roles in top global
        institutions in the US, Europe, China, Australia, Vietnam, and
        Singapore. You will dream big.
      </>
    ),
  },
  {
    num: "08",
    title: "We pay competitively",
    text: (
      <>
        PhD candidates receive full{" "}
        <a
          href="https://graduatestudies.smu.edu.sg/phd/awards-funding/scholarships"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4 decoration-border/80 hover:text-primary hover:decoration-primary transition-colors"
        >
          scholarships
        </a>
        . Most other research roles are paid competitive research salaries.
      </>
    ),
  },
  {
    num: "09",
    title: "We play",
    text: "We are a dynamic, close-knit group who celebrate milestones, run outdoor retreats, and enjoy good food together. You will have fun.",
  },
  {
    num: "10",
    title: "We do what's right",
    text: "We do the right things and get them right. We get the right people and do right by them. You will make the right choice.",
  },
];

const openPositions = [
  {
    title: "Postdoctoral Research Fellow",
    description:
      "PhD degree in Computer Science or related field with a strong publication record in top AI/ML venues.",
    topics:
      "Probabilistic graphical modeling, deep learning, topic modeling, recommender systems, dimensionality reduction, similarity search, text mining, and information extraction.",
  },
  {
    title: "PhD Candidate / Research Engineer",
    description:
      "Bachelor's and/or Master's degree in Computer Science or closely related discipline with high academic standing.",
    topics:
      "Competent in systems programming and data management, with foundations in data mining and machine learning. Research experience is a strong plus.",
  },
  {
    title: "Research Intern / Visiting Student",
    description:
      "Currently enrolled undergraduate or Master's student in Computer Science or related quantitative field.",
    topics:
      "Competent programming skills, strong self-motivation, and genuine curiosity in recommendation systems or machine learning research.",
  },
];

export default function JoinPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Join Preferred.AI
        </h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
          We are growing, and always on the lookout for bright, dedicated, and
          curious individuals to become part of our research team.
        </p>
      </div>

      {/* Ten Reasons Section */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground/80 mb-4 select-none">
          Why Preferred.AI
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reasons.map((reason) => (
            <div
              key={reason.num}
              className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-primary/40 transition-all flex flex-col group"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[11px] font-mono font-semibold text-primary/80">
                  {reason.num}
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                {reason.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Roles Section */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground/80 mb-4 select-none">
          Candidate Profiles
        </h2>

        <div className="space-y-4">
          {openPositions.map((pos) => (
            <div
              key={pos.title}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-primary/40 transition-all group"
            >
              <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {pos.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                {pos.description}
              </p>
              <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                <strong className="text-foreground font-semibold">
                  Focus areas:{" "}
                </strong>
                {pos.topics}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-muted/40 border border-border/80 text-center flex flex-col items-center">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
          Ready to apply?
        </h2>
        <p className="text-xs text-muted-foreground max-w-lg mb-5 leading-relaxed">
          Send your CV, transcripts, and brief research interests to Associate
          Professor Hady W. Lauw.
        </p>
        <a
          href="mailto:hadywlauw@smu.edu.sg"
          className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-semibold tracking-wide text-white bg-primary hover:bg-primary/90 transition-all shadow-xs hover:scale-105 active:scale-95"
        >
          Email hadywlauw@smu.edu.sg
        </a>
      </div>
    </div>
  );
}
