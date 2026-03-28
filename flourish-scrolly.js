function initStories() {
    var stories = document.querySelectorAll(".flourish-embed");
    for (var i = 0; i < stories.length; i++) {
        var story = stories[i];
        
        if (story.id === "green-jobs-story") {
            var id = story.dataset.src.split("/")[1];
            var h = story.getAttribute("data-height") || "75vh";
            var last_link = last_link_per_story["story-" + id];
            var common_parent = commonAncestor(story, last_link);

            story.id = "story-" + id;

            var target_div = document.createElement("div");
            target_div.classList.add("fl-scrolly-section");
            target_div.style.position = "relative";
            target_div.style.paddingBottom = "1px";
            target_div.id = "fl-scrolly-section-" + id;

            common_parent.classList.add("fl-scrolly-parent-" + id);

            var children = document.querySelectorAll(".fl-scrolly-parent-" + id + " > *");
            story.__found_story__ = false;
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                if (story.__found_story__) {
                    target_div.appendChild(child);
                    if (child.querySelector(".fl-scrolly-last-link-story-" + id)) break;
                }
                else {
                    var embed = child.id == "story-" + id || child.querySelector("#story-" + id);
                    if (embed) {
                        story.__found_story__ = true;
                        child.style.top = "calc(50vh - " + h + "/2)";
                        child.classList.add("fl-scrolly-sticky");
                        common_parent.insertBefore(target_div, child);
                        target_div.appendChild(child);
                    }
                }
            }
        }
    }
}

var last_link_per_story = {};
function initLinks() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        var link = links[i],
            href = link.getAttribute("href");

        if (!href || !href.match(/#story\/\d+/)) continue;

        var id = href.split("/")[1];
        last_link_per_story["story-" + id] = link;
        link.classList.add("fl-scrolly-link");
        link.classList.add("story-" + id);
        link.parentNode.classList.add("fl-scrolly-step");

        link.addEventListener("click", function(e) {
            e.preventDefault();
            updateStoryFromLink(this);
        });
    }
    for (var link in last_link_per_story) {
        last_link_per_story[link].classList.add("fl-scrolly-last-link-" + link);
    }
}

function initIntersection() {
    var observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) updateStoryFromLink(entry.target);
        });
    }, { rootMargin: "0px 0px -50% 0px" });
    document.querySelectorAll(".fl-scrolly-link").forEach(function(link) {
        return observer.observe(link);
    });
}

function updateStoryFromLink(el) {
    var link_array = el.getAttribute("href").split("/");
    var slide_number = parseFloat(link_array[link_array.length - 1].replace("slide-", ""));
    var slide_id = slide_number - 1;

    var container = document.querySelector("#green-jobs-story");
    if (!container) return;

    var iframe = container.querySelector("iframe");
    if (iframe) {
        iframe.src = iframe.src.replace(/#slide-.*/, "") + "#slide-" + slide_id;
    }
}

function parents(node) {
    var nodes = [node]
    for (; node; node = node.parentNode) {
        nodes.unshift(node)
    }
    return nodes;
}

function commonAncestor(node1, node2) {
    var parents1 = parents(node1);
    var parents2 = parents(node2);
    if (parents1[0] != parents2[0]) throw "No common ancestor!";
    for (var i = 0; i < parents1.length; i++) {
        if (parents1[i] != parents2[i]) return parents1[i - 1]
    }
}

function init() {
    initLinks();
    initStories();
    initIntersection();
}
init();