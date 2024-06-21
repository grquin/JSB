import Link from 'next/link';
import { createClient } from 'next-sanity';
import { groq } from 'next-sanity';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import ArrowIcon from '../components/ArrowIcon';
import SEO from '../components/SEO';
import IntakeForm from '../components/IntakeForm';
import { getGlobalData } from '../utils/global-data';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-06-01',
});

const query = groq`*[_type == "post"]{
  title,
  slug,
  body,
  publishedAt,
  "seoTitle": seoTitle,
  "seoDescription": seoDescription
}`;

export default function Index({ posts, globalData }) {
  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.blogTitle} />
      <Header name={globalData.name} />
      <main className="w-full">
        <h1 className="text-3xl lg:text-5xl text-center mb-12">
          {globalData.blogTitle}
        </h1>
        <IntakeForm />
        <ul className="w-full">
          {posts.map((post) => (
            <li
              key={post.slug.current}
              className="md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-b-0 last:border-b hover:border-b hovered-sibling:border-t-0"
            >
              <Link
                as={`/posts/${post.slug.current}`}
                href={`/posts/[slug]`}
                className="py-6 lg:py-10 px-6 lg:px-16 block focus:outline-none focus:ring-4"
              >
                {post.publishedAt && (
                  <p className="uppercase mb-3 font-bold opacity-60">
                    {new Date(post.publishedAt).toDateString()}
                  </p>
                )}
                <h2 className="text-2xl md:text-3xl">{post.title}</h2>
                {post.seoDescription && (
                  <p className="mt-3 text-lg opacity-60">
                    {post.seoDescription}
                  </p>
                )}
                <ArrowIcon className="mt-4" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const posts = await client.fetch(query);
    const globalData = getGlobalData();
    return { props: { posts, globalData } };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { props: { posts: [] } };
  }
}
