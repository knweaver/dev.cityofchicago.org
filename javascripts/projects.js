<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-39101739-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

    </script>
    <script type="text/javascript" src="javascripts/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="javascripts/strftime.js"></script>
    <script type="text/javascript">
    (function ($, undefined) {

      // Put custom repo URL's in this object, keyed by repo name.
      var repoUrls = {
        "bootstrap": "http://twitter.github.com/bootstrap/",
        "finagle": "http://twitter.github.com/finagle/",
        "hogan.js": "http://twitter.github.com/hogan.js/"
      };

      function repoUrl(repo) {
        return repoUrls[repo.name] || repo.html_url;
      }

      // Put custom repo descriptions in this object, keyed by repo name.
      var repoDescriptions = {
        "bootstrap": "An HTML, CSS, and JS toolkit designed to kickstart development of webapps and sites",
        "naggati2": "A protocol builder for Netty using Scala 2.8"
      };

      function repoDescription(repo) {
        return repoDescriptions[repo.name] || repo.description;
      }

      function addRecentlyUpdatedRepo(repo) {
        var $item = $("<li>");

        var $name = $("<a>").attr("href", repo.html_url).text(repo.name);
        $item.append($("<span>").addClass("name").append($name));

        var $time = $("<a>").attr("href", repo.html_url + "/commits").text(strftime("%h %e, %Y", repo.pushed_at));
        $item.append($("<span>").addClass("time").append($time));

        $item.append('<span class="bullet">&sdot;</span>');

        var $watchers = $("<a>").attr("href", repo.html_url + "/watchers").text(repo.watchers + " stargazers");
        $item.append($("<span>").addClass("watchers").append($watchers));

        $item.append('<span class="bullet">&sdot;</span>');

        var $forks = $("<a>").attr("href", repo.html_url + "/network").text(repo.forks + " forks");
        $item.append($("<span>").addClass("forks").append($forks));

        $item.appendTo("#recently-updated-repos");
      }

      function addRepo(repo) {
        var $item = $("<li>").addClass("repo grid-1 " + (repo.language || '').toLowerCase());
        var $link = $("<a>").attr("href", repoUrl(repo)).appendTo($item);
        $link.append($("<h3>").text(repo.name));
        $link.append($("<h4>").text(repo.language));
        // $link.append($("<p>").text(repoDescription(repo)));
        $item.appendTo("#repos");
      }

      function addRepos(repos, page) {
        repos = repos || [];
        page = page || 1;

        var uri = "https://api.github.com/orgs/Chicago/repos?callback=?"
          + "&client_id="
          + "e5b97316720a38c8dbd1"
          + "&client_secret="
          + "7a51be56b51c1e7b2bfea5c8bffe4477554ed57d"
          + "&per_page=100"
          + "&page="+page;

        $.getJSON(uri, function (result) {
          if (result.data && result.data.length > 0) {
            repos = repos.concat(result.data);
            addRepos(repos, page + 1);
          }
          else {
            $(function () {
              $("#num-repos").text(repos.length);

              // Convert pushed_at to Date.
              $.each(repos, function (i, repo) {
                repo.pushed_at = new Date(repo.pushed_at);

                var weekHalfLife  = 1.146 * Math.pow(10, -9);

                var pushDelta    = (new Date) - Date.parse(repo.pushed_at);
                var createdDelta = (new Date) - Date.parse(repo.created_at);

                var weightForPush = 1;
                var weightForWatchers = 1.314 * Math.pow(10, 7);

                repo.hotness = weightForPush * Math.pow(Math.E, -1 * weekHalfLife * pushDelta);
                repo.hotness += weightForWatchers * repo.watchers / createdDelta;
              });

              // Sort by highest # of watchers.
              repos.sort(function (a, b) {
                if (a.hotness < b.hotness) return 1;
                if (b.hotness < a.hotness) return -1;
                return 0;
              });

              $.each(repos, function (i, repo) {
                addRepo(repo);
              });

              // Sort by most-recently pushed to.
              repos.sort(function (a, b) {
                if (a.pushed_at < b.pushed_at) return 1;
                if (b.pushed_at < a.pushed_at) return -1;
                return 0;
              });

              $.each(repos.slice(0, 3), function (i, repo) {
                addRecentlyUpdatedRepo(repo);
              });
            });
          }
        });
      }
      addRepos();

      //get total number of Twitter members
      function getNumMembers(page, numMembers) {
        var page = page || 1;
        var numMembers = numMembers || 0;
        var membersUri = "https://api.github.com/orgs/Chicago/members?callback=?"
          + "&client_id="
          + "e5b97316720a38c8dbd1"
          + "&client_secret="
          + "7a51be56b51c1e7b2bfea5c8bffe4477554ed57d"
          + "&per_page=100"
          + "&page="+page;

        $.getJSON(membersUri, function (result) {
          if (result.data && result.data.length > 0) {
            numMembers += result.data.length;
            getNumMembers(page+1, numMembers);
          } else {
            $(function () {
              $("#num-members").text(numMembers);
            });
          }
        });
      }
      getNumMembers();

      function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
      }

      var $flyzone;

      function flyzone() {
        if (!$flyzone) {
          $flyzone = $("<div>").attr("id", "flyzone").prependTo(document.body);
        }

        return $flyzone;
      }

      var sizes = ["smaller", "small", "medium", "large", "fat"];

      var sizeDimensions = {
        "smaller": 50,
        "small": 80,
        "medium": 130,
        "large": 200,
        "fat": 300
      };

      function randomOpacity(threshold) {
        var opacity = Math.random();

        while (opacity < threshold) {
          opacity = Math.random();
        }

        return opacity;
      }
    })(jQuery);
</script>