const GoogleAnalytics = () => {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GOOGLE_ANALYTICS_KEY}`}></script>
      <script>
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments)}
        gtag('js', new Date()); 
        gtag('config', '${process.env.REACT_APP_GOOGLE_ANALYTICS_KEY}');`}
      </script>
    </>
  );
};

export default GoogleAnalytics;
