import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { forwardRef } from 'react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = '', meta, ...other }, ref) => (
  <>
    <Helmet>
      <title>{`${title} | Terakom`}</title>
      <meta name="description" content="undefined" />

      <meta property="og:url" content="https://github.com/theodevoid/v6-academy/blob/main/apps/web/src/components/HeadMetaData.tsx" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title + ' | Terakom'} />
      <meta property="og:description" content="undefined" />
      <meta property="og:image" content="" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="github.com" />
      <meta property="twitter:url" content="https://github.com/theodevoid/v6-academy/blob/main/apps/web/src/components/HeadMetaData.tsx" />
      <meta name="twitter:title" content={title + ' | Terakom'} />
      <meta name="twitter:description" content="undefined" />
      <meta name="twitter:image" content="" />
      {meta}
    </Helmet>

    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
