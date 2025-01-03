function scroll_to_bottom() {
  $("#chat_list_id").scrollTop($("#chat_list_id")[0].scrollHeight);
}
scroll_to_bottom();

function get_time_now() {
  let time_now = new Date();
  let hours = time_now.getHours();
  let minutes = time_now.getMinutes();
  let am_pm = "am";
  if (hours > 12) {
    hours -= 12;
    am_pm = "pm";
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let time = hours + ":" + minutes + " " + am_pm;
  return time;
}

function send_message() {
  let query = $("#query_id").val();

  if (query == "") return;

  let data = { query: query };

  $("#chat_list_id").append(`
    <li class="right chat_item">
        <div>${query}</div>
        <div><b>${get_time_now()}</b></div>
    </li>`);
  scroll_to_bottom();
  $("#query_id").val("");
  $("#query_id").focus();

  let random_id = Math.random().toString(36).substring(7);
  $("#chat_list_id").append(`
    <li class="left chat_item" id="message_${random_id}">
        <div id="${random_id}"></div>
    </li>`);
  let previous_messages = ["Espere un momento...", "Un momento por favor...", "Un momento..."];
  let random_message = previous_messages[Math.floor(Math.random() * previous_messages.length)];
  document.getElementById(random_id).innerHTML = random_message;
  scroll_to_bottom();

  $.ajax({
    type: "GET",
    url: "https://us-central1-sinfony-cbd19.cloudfunctions.net/sinfony-multi-agent-v2", //https://us-central1-sinfony-cbd19.cloudfunctions.net/sinfony-multi-agent-v2
    data: data,
    success: function (data) {
      let html_content = marked(data.content);
      $(`#message_${random_id}`).append(`
            <div id="${random_id}"></div>
            <div><b>${get_time_now()}</b></div>`);
      document.getElementById(random_id).innerHTML = html_content;
      scroll_to_bottom();
    },
    error: function (data) {
      console.log(data);
    },
  });
}

$("#send_button_id").click(function () {
  send_message();
});

$("#query_id").keypress(function (e) {
  if (e.which == 13) {
    send_message();
  }
});
