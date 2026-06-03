import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Join Preferred.AI - We are growing, and always on the lookout for bright, dedicated, and nice individuals to become a part of us.",
};

export default function JoinPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Join Us</h1>

      <h2 className="text-3xl font-bold mb-8">
        Ten Reasons Why You Should Join Preferred.AI
      </h2>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px mb-8 bg-border border border-border rounded-2xl overflow-hidden shadow-sm shadow-black/[0.01]">
        {/* Row 1 */}
        <div className="p-6 bg-muted/40 dark:bg-card/20 flex flex-col">
          <div className="text-center mb-4">
            <span className="text-4xl">📰</span>
          </div>
          <h3 className="text-center font-bold mb-4 text-foreground">
            We <em>publish</em>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            We hold ourselves to a high standard. Our{" "}
            <a href="/publications" className="text-primary hover:underline font-semibold">
              publications
            </a>{" "}
            appear in top-tier venues. A couple have won awards:{" "}
            <a
              href="https://ijcai20.org/distinguished-papers/"
              className="text-primary hover:underline font-semibold"
            >
              IJCAI-PRICAI 2020 Distinguished Paper
            </a>{" "}
            and{" "}
            <a
              href="https://aaai.org/about-aaai/aaai-awards/aaai-conference-paper-awards-and-recognition/"
              className="text-primary hover:underline font-semibold"
            >
              AAAI 2014 Honorable Mention
            </a>
            . You will aim high.
          </p>
        </div>

        <div className="p-6 bg-muted/40 dark:bg-card/20 flex flex-col">
          <div className="text-center mb-4">
            <span className="text-4xl">⭐</span>
          </div>
          <h3 className="text-center font-bold mb-4 text-foreground">
            We <em>achieve</em>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            Our PhD candidates have been winning{" "}
            <a
              href="https://graduatestudies.smu.edu.sg/phd/research-achievements/presidential-doctoral-fellowship"
              className="text-primary hover:underline font-semibold"
            >
              SMU Presidential Doctoral Fellowships
            </a>{" "}
            for nine years running. You will get things done.
          </p>
        </div>

        <div className="p-6 bg-muted/40 dark:bg-card/20 flex flex-col">
          <div className="text-center mb-4">
            <span className="text-4xl">⚡</span>
          </div>
          <h3 className="text-center font-bold mb-4 text-foreground">
            We seek <em>impact</em>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            We{" "}
            <a
              href="https://github.com/PreferredAI/cornac"
              className="text-primary hover:underline font-semibold"
            >
              develop
            </a>{" "}
            useful libraries and learning materials,{" "}
            <Link
              href="/category/education"
              className="text-primary hover:underline font-semibold"
            >
              teach
            </Link>{" "}
            others, and{" "}
            <Link
              href="/category/presentation"
              className="text-primary hover:underline font-semibold"
            >
              present
            </Link>{" "}
            our work. You will matter.
          </p>
        </div>

        {/* Row 2 */}
        <div className="p-6 bg-muted/40 dark:bg-card/20 flex flex-col">
          <div className="text-center mb-4">
            <span className="text-4xl">🖥️</span>
          </div>
          <h3 className="text-center font-bold mb-4 text-foreground">
            We are <em>equipped</em>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            We have resources: CPU servers, GPU servers, interesting datasets,
            &lt;insert what you need&gt;. You will have what you need to pursue
            high-quality research.
          </p>
        </div>

        <div className="p-6 bg-muted/40 dark:bg-card/20 flex flex-col">
          <div className="text-center mb-4">
            <span className="text-4xl">🌍</span>
          </div>
          <h3 className="text-center font-bold mb-4 text-foreground">
            We are <em>diverse</em>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            Our members come from all over the world: Singapore, Indonesia,
            Vietnam, China, Russia, France, Algeria, Greece, Philippines, Sri
            Lanka, &lt;insert your country here&gt;. You will fit in.
          </p>
        </div>

        <div className="p-6 bg-muted/40 dark:bg-card/20 flex flex-col">
          <div className="text-center mb-4">
            <span className="text-4xl">🚀</span>
          </div>
          <h3 className="text-center font-bold mb-4 text-foreground">
            We are <em>up-and-coming</em>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            <a
              href="https://csrankings.org/#/index?ai&vision&mlmining&nlp&inforet&world"
              className="text-primary hover:underline font-semibold"
            >
              CSRankings.org
            </a>{" "}
            places SMU at #30 worldwide (Dec&apos;25) for AI areas (incl. KDD).
            No
            mean feat for a young school. You will grow along with us.
          </p>
        </div>

        {/* Row 3 */}
        <div className="p-6 bg-muted/40 dark:bg-card/20 flex flex-col">
          <div className="text-center mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <h3 className="text-center font-bold mb-4 text-foreground">
            We plan <em>ahead</em>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            Our{" "}
            <a
              href="https://www.hadylauw.com/group/alumni"
              className="text-primary hover:underline font-semibold"
            >
              graduates
            </a>{" "}
            go on to academic and industrial positions in well-known
            institutions in USA, Europe, China, Australia, Vietnam, Singapore.
            You will dream big, and we will work hard together towards it.
          </p>
        </div>

        <div className="p-6 bg-muted/40 dark:bg-card/20 flex flex-col">
          <div className="text-center mb-4">
            <span className="text-4xl">💰</span>
          </div>
          <h3 className="text-center font-bold mb-4 text-foreground">
            We <em>pay</em>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            PhD candidates receive{" "}
            <a
              href="https://graduatestudies.smu.edu.sg/phd/awards-funding/scholarships"
              className="text-primary hover:underline font-semibold"
            >
              scholarships
            </a>
            . Most other positions are paid{" "}
            <a className="text-primary hover:underline font-semibold">competitive salaries</a>
            . You will have enough.
          </p>
        </div>

        <div className="p-6 bg-muted/40 dark:bg-card/20 flex flex-col">
          <div className="text-center mb-4">
            <span className="text-4xl">🎉</span>
          </div>
          <h3 className="text-center font-bold mb-4 text-foreground">
            We <em>play</em>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground flex-1">
            We are a dynamic, close-knit{" "}
            <a
              href="https://www.hadylauw.com/group"
              className="text-primary hover:underline font-semibold"
            >
              group
            </a>
            , who work and play together. You will have fun.
          </p>
        </div>
      </div>

      {/* 1x1 Table */}
      <div className="border border-border rounded-2xl overflow-hidden mb-8 shadow-sm shadow-black/[0.01]">
        <div className="p-6 bg-muted/40 dark:bg-card/20 text-center">
          <div className="mb-4">
            <span className="text-4xl">👍</span>
          </div>
          <h3 className="font-bold mb-4 text-foreground">
            We do what&apos;s <em>right</em>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We do the right things and get them right. We get the right people
            and do right by them. You will make the right choice.
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4 text-center">
        <a
          href="mailto:hadywlauw@smu.edu.sg"
          className="text-primary hover:underline"
        >
          Email
        </a>{" "}
        us your latest CV now.
      </h3>

      <p className="mb-6 text-center">
        We are growing, and always on the lookout for bright, dedicated, and
        nice individuals to become a part of us.
      </p>

      <ul className="space-y-4 list-none pl-0">
        <li>
          <strong>■ Postdoc candidate</strong> has a PhD degree with a promising
          academic record. Topics considered particularly relevant include:
          probabilistic graphical modeling, deep learning, topic modeling,
          recommender systems, dimensionality reduction, similarity search, text
          mining, and information extraction. A strong background in other data
          mining and machine learning topics will also be considered.
        </li>
        <li>
          <strong>■ PhD Student or Research Engineer candidate</strong> has a
          Bachelor&apos;s and/or Master&apos;s degree in Computer Science or a
          closely-related discipline with high academic standing. He or she is
          competent in programming and data management, with knowledge of data
          mining and machine learning concepts. Past experience, as well as
          future interest, in research is a plus.
        </li>
        <li>
          <strong>■ Intern or Research Student candidate</strong> is someone
          currently still enrolled in a Bachelor&apos;s and/or Master&apos;s
          degree in Computer Science or a closely-related discipline with high
          academic standing. He or she is competent in programming, with
          interest and/or experience in data mining or machine learning
          research.
        </li>
      </ul>
    </div>
  );
}
