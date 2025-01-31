import { useEffect } from 'react';

const Messenger = () => {
  useEffect(() => {
    // Ensure the window object exists (client-side only)
    if (typeof window !== 'undefined') {
      window.fbAsyncInit = function () {
        window.FB.init({
          xfbml: true,
          version: 'v10.0', // Use the desired Facebook SDK version
        });
      };

      // Load the Facebook SDK asynchronously
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }
  }, []);

  return (
    <div className="fb-customerchat" attribution="setup_tool" page_id="111752920959492">
      {/* Messenger chatbox will be loaded here */}
    </div>
  );
};

export default Messenger;
