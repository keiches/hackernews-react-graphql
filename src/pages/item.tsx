import { gql } from 'apollo-server-express';
import * as React from 'react';
import { graphql } from 'react-apollo';

import { commentsFragment } from '../components/comments';
import { newsDetailNewsItemFragment } from '../components/news-detail';
import { INewsItemWithCommentsProps, NewsItemWithComments } from '../components/news-item-with-comments';
import { newsTitleFragment } from '../components/news-title';
import { NewsItem } from '../data/models';
import { withData } from '../helpers/with-data';
import { MainLayout } from '../layouts/main-layout';

export interface INewsItemWithCommentsQuery {
  newsItem: NewsItem;
}

const newsItemWithCommentsQuery = gql`
  query NewsItemWithComments($id: Int!) {
    newsItem(id: $id) {
      id
      comments {
        ...Comments
      }
      ...NewsTitle
      ...NewsDetail
    }
  }
  ${newsTitleFragment}
  ${newsDetailNewsItemFragment}
  ${commentsFragment}
`;

export interface INewsItemWithCommentsWithGraphQLOwnProps {
  id: number;
}

const NewsItemWithCommentsWithGraphQL = graphql<
  INewsItemWithCommentsWithGraphQLOwnProps,
  INewsItemWithCommentsQuery,
  {},
  INewsItemWithCommentsProps
>(newsItemWithCommentsQuery, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
  props: ({ data }) => ({
    error: data.error,
    loading: data.loading,
    newsItem: data.newsItem,
  }),
})(NewsItemWithComments);

export const ItemPage = withData(props => (
  <MainLayout currentUrl={props.url.pathname}>
    <NewsItemWithCommentsWithGraphQL id={(props.url.query && +props.url.query.id) || 0} />
  </MainLayout>
));

export default ItemPage;
