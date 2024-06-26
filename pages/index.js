import Link from 'next/link';
import client from '../lib/sanity'; // Import the Sanity client
import { groq } from 'next-sanity';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import ArrowIcon from '../components/ArrowIcon';
import SEO from '../components/SEO';
import IntakeForm from '../components/IntakeForm';
import { getGlobalData } from '../utils/global-data';

const query = groq`*[_type == "post"]{
  _id,
  title,
  "slug": slug.current, // Ensure the slug is properly selected
  body,
  publishedAt,
  "seoTitle": seoTitle,
  "seoDescription": seoDescription
}`;

export async function getStaticProps() {
  try {
    console.log('Fetching posts from Sanity...');
    let posts = await client.fetch(query);
    posts = posts.filter(post => post.slug); // Filter out posts without slugs
    console.log('Fetched posts:', posts);
    const globalData = getGlobalData();
    return { props: { posts, globalData } };
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return { props: { posts: [], globalData: getGlobalData() } };
  }
}

export default function Index({ posts, globalData }) {
  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.blogTitle} />
      <Header name={globalData.name} />
      <main className="w-full">
        <h1 className="text-3xl lg:text-5xl text-center mb-12">
          {globalData.blogTitle}
        </h1>
        <IntakeForm /> {/* Include IntakeForm component */}
        <ul className="w-full">
          {posts.map((post) => (
            <li
              key={post._id}
              className="md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-b-0 last:border-b hover:border-b hovered-sibling:border-t-0"
            >
              <Link
                as={`/posts/${post.slug}`}
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
