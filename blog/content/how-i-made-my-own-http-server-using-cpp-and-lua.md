+++
title = "How I made my own HTTP server using C++ and Lua"
description = "Building an HTTP server from scratch using C++ for networking and Lua for request processing"
date = 2023-09-01

[taxonomies]
tags = ["cpp", "webdev", "programming"]

[extra]
lang = "en"
toc = true
comment = false
copy = true
+++

> [!NOTE]
> **Before we start**
> This small piece was written in September 2023, by the time I finally decided to publish it I might have made a few changes to the code.
> Follow the README and NOTES files.
> Alright, here we go...

## Why ??

Due to a combination of curiosity and boredom, I found myself asking, "Can everything be made in any language? Can I create a website using C? Or even C++? To facilitate the development process, I could choose to incorporate Lua". And that's exactly what I did, sacrificing a portion of my time, sleep, and mental health to pursue this objective.

## From the server to your browser

Before delving into the code, I needed to understand the underlying workings to determine what needed to be done.

### Understanding what happens

![](https://res.cloudinary.com/ddbfjkbdu/image/upload/w_1000/v1724777551/http_communication_iu5hu8.png)

#### What happens when you look for google.com ?

When you type a link into your browser's address bar and press enter, several steps are followed to get the webpage and display it on your screen:

1. Address Resolution: The browser begins by resolving the domain name in the link to obtain the IP address of the web server that hosts the website.
2. Establishing a Connection: Once the IP address is obtained, the browser opens a TCP  connection to the web server. This involves a series of handshakes and acknowledgments to establish a reliable connection.
3. Sending a Request: The browser then sends an HTTP (Hypertext Transfer Protocol) request to the web server, specifying the URL, the desired resource (such as the HTML file), and any additional headers or parameters.
4. Server Processing: The web server receives the HTTP request, processes it, and prepares the requested resource for delivery. This may involve accessing databases, executing server-side scripts, or performing other necessary tasks.
5. Retrieving the Webpage: Once the server has processed the request, it retrieves the requested webpage (HTML content) from its storage or generates it dynamically. The server then sends back an HTTP response containing the requested webpage.
6. HTML Parsing: Upon receiving the response, the browser starts parsing the HTML content. It reads and interprets the HTML tags and constructs a Document Object Model (DOM) tree, which represents the structure and content of the webpage.
7. Resource Fetching: While parsing the HTML, the browser encounters various resources referenced within the webpage, such as CSS files, JavaScript files, images, and more. It starts fetching these resources concurrently to avoid blocking the main rendering process.
8. Rendering the Page: As the browser receives each resource, it starts rendering the webpage on your screen. It processes the CSS to style the content, executes any JavaScript code, and combines all the resources to display the final webpage composition.

Each of these steps happens within milliseconds or even faster, providing you with a seemingly instantaneous loading of web pages.

Based on that we understand that since the page itself is only written in HTML, CSS, and JS we will use C++ for the server to handle HTTP requests.

From that we are left with 3 steps:

- Establishing the connection and receiving the request
- Processing the request
- Sending it back

## Step 1: Establishing the connection and receiving requests

![https://media.giphy.com/media/l41YvpiA9uMWw5AMU/giphy.gif](https://media.giphy.com/media/l41YvpiA9uMWw5AMU/giphy.gif)

To handle incoming requests, the server first starts by listening for new connections. Once a new connection is established, the server reads the HTTP request.
HTTP requests are transmitted through TCP, so a TCP listener is necessary to listen for any incoming messages.
After receiving the message, the server needs to parse it to extract the relevant information and understand what actions should be taken.

### Understanding and parsing the request

![](https://res.cloudinary.com/ddbfjkbdu/image/upload/w_1000/v1724777552/parsing_http_request_qjcfiw.png)

HTTP requests are text-based requests that the browser sends to the server, in their base form they generally look like this:

![](https://res.cloudinary.com/ddbfjkbdu/image/upload/w_1000/v1724777554/http_request_asu5d1.png)

When it comes to reading and understanding text, plain text is a great choice. It provides simplicity and clarity, making it easy for anyone to comprehend.

Let's take a closer look at the structure of an HTTP request. The first line holds significant details, including the HTTP verb (such as GET or POST), the host (which indicates what the browser is searching for), and the HTTP version. In the case of my server, it supports HTTP/1, as it offers a more straightforward implementation process.

For me, the most crucial information lies within the verb and the host. They provide valuable insights into the user's intention and the specific destination they are requesting.

Moving on from the first line, we encounter the headers. These headers play a crucial role in the request, as they consist of key-value pairs separated by colons. They provide additional information and instructions to the server, guiding it in processing the request effectively.

So, in summary, the HTTP request structure is composed of easily digestible text. It starts with the informative first line, followed by headers that enhance the request's context through key-value pairs.

From there we know what to look for.

## Step 2: Processing the requests

![](https://res.cloudinary.com/ddbfjkbdu/image/upload/w_1000/v1724777552/data_processing_vqbc6d.png)

> NACA researchers using an IBM type 704 electronic data processing machine in 1957

To process the request, I decided to use Lua.

The reason behind this choice lies in the fact that Lua seamlessly integrates with C++, offering a smooth and efficient development experience.

Additionally, Lua boasts excellent performance, making it an ideal language for handling various server-related tasks. Moreover, Lua provides a wide range of existing libraries that can be leveraged for data fetching, database operations, and other server functionalities. By using Lua, I was able to streamline the development process and ensure optimal performance for the server.

![](https://res.cloudinary.com/ddbfjkbdu/image/upload/w_1000/v1724777551/lua_performance_graph_fb75tk.png)

> Comparison of lua with other languages in terms of execution times

### How the server works

Since the processing part had to be in Lua I had to implement a proper structure for the projects

![](https://res.cloudinary.com/ddbfjkbdu/image/upload/v1724777552/project_structure_eldb0s.png)

- libs: Contains lua libraries that the server might need for processing
- middlewares: Contains all the middlewares for each request
- routes: contains request routes
- noon.config.lua: It's where we define each route and the web app configurations.

If you need to dive deeper into it you can check [the GitHub repo](https://github.com/lakubuDavid/Noon) where I have a `README.md` and `NOTE.md` file ready with all the explanations.

#### Resolving the correct route

To make sure we handle incoming requests properly, we gotta send them to the right handler. And that's where the router comes in handy. Its job is to guide each request to the correct handler. The process of figuring out the route path is pretty simple. First, when we launch the server, we define each route in the `noon.config.lua` file and attach it to a corresponding handler script. Then, when a request arrives, the router follows a logic to figure out which route to call.

![](https://res.cloudinary.com/ddbfjkbdu/image/upload/w_1000/v1724777553/request_routing_xtuhyd.png)

So this basically means that in code, it looks like this:

```cpp
EndpointMatch match = parseUrl(path);

//  Look for the route
if (this->routes.find(match.path) != this->routes.end()) {
    match.endpoint = routes[match.path];
}
//  Look for a static file
else if (exists(getPath("static/" + path))) {
    match.endpoint = path;
}
else {
    // Check catch all routes
    ...
    // Check dynamic routes
    ...
    if (!found) {
        match.endpoint = "404";
    }
}
return match;
```

## Step 3: Sending the response back

Once the request has been processed we need to send back the response. You have to note that the browser is expecting an HTTP response so we have to format it in HTTP.

![](https://res.cloudinary.com/ddbfjkbdu/image/upload/w_1000/v1724777551/http_request_pipeline_srcofw.png)

An HTTP response typically consists of several parts including:

1. Status Line: The status line of an HTTP response includes the HTTP version, status code, and a short status message. For example: `HTTP/1.1 200 OK`.
2. Headers: HTTP headers provide additional information about the response. Some commonly used headers include:
    - Content-Type: Specifies the type of data in the response (e.g., text/html, application/json, image/jpeg).
    - Content-Length: Indicates the length of the response content in bytes.
    - Cache-Control: Specifies caching instructions for the response.
    - Set-Cookie: Sets a cookie in the client's browser for future requests.
3. Body: The response body contains the actual data returned by the server. The content and structure of the body depend on the type of response. For example, if the response is an HTML document, the body will contain HTML tags and content. In the case of a JSON response, the body will contain JSON-encoded data.

## Conclusion

After spending a few months on this project I came up with a pretty decent, working HTTP server.
[Here](https://github.com/lakubuDavid/Noon) is the project if you want to check it out.

Working on this project was a really good opportunity to understand how HTTP servers generally work and to be able to see by myself all the theories that I was taught.
If I had to make any improvement it would be:
- HTTPS support
- Better middlewares
- Static file serving
