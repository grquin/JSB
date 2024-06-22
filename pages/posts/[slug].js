import { useRouter } from 'next/router';
import { groq } from 'next-sanity';
import client from '../../lib/sanity';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import { getGlobalData } from '../../utils/global-data';
import ArrowIcon from '../../components/ArrowIcon';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import CustomLink from '../../components/CustomLink';
import { MDXRemote } from 'next-mdx-remote';

const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  slug,
  body,
  publishedAt,
  "seoTitle": seoTitle,
  "seoDescription": seoDescription
}`;

const pathsQuery = groq`*[_type == "post" && defined(slug.current)][]{
  "params": { "slug": slug.current }
}`;

export async function getStaticPaths() {
  const paths = await client.fetch(pathsQuery);
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const post = await client.fetch(postQuery, { slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  const globalData = getGlobalData();
  return {
    props: {
      post,
      globalData,
    },
    revalidate: 60, // Revalidate at most once every minute
  };
}

export default function Post({ post, globalData }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <SEO title={post.seoTitle || post.title} description={post.seoDescription || post.body} />
      <Header name={globalData.name} />
      <article className="px-6 md:px-0">
        <header>
          <h1 className="text-3xl md:text-5xl dark:text-white text-center mb-12">
            {post.title}
          </h1>
          {post.seoDescription && (
            <p className="text-xl mb-4">{post.seoDescription}</p>
          )}
        </header>
        <main>
          <article className="prose dark:prose-dark">
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </article>
        </main>
        <div className="grid md:grid-cols-2 lg:-mx-24 mt-12">
          {/* Implement previous and next post navigation if necessary */}
        </div>
      </article>
      <Footer copyrightText={globalData.footerText} />
    </Layout>
  );
}
