// Capi Career Path Simulator — data layer
// Roles: 5 career archetypes. Each answer contributes to a role weight.

export const CAPI_ROLES = {
  Explorer: {
    name: "Explorer",
    tagline: "Người Khám Phá",
    color: "#7c5cff",
    icon: "compass",
    blurb: "Bạn được dẫn dắt bởi sự tò mò. Bạn đặt câu hỏi đúng trước khi tìm ra giải pháp, và yêu thích việc khoanh vùng vấn đề.",
    careers: ["Nhà nghiên cứu", "Data Scientist", "UX Researcher", "Phân tích kinh doanh"],
  },
  Builder: {
    name: "Builder",
    tagline: "Người Kiến Tạo",
    color: "#00e5ff",
    icon: "hammer",
    blurb: "Bạn thích biến ý tưởng thành sản phẩm thực. Nhúng tay vào làm, thử-sai, cải tiến — đó là sân chơi của bạn.",
    careers: ["Kỹ sư phần mềm", "Robotics Engineer", "Product Designer", "Kiến trúc sư"],
  },
  Operator: {
    name: "Operator",
    tagline: "Người Vận Hành",
    color: "#ffb020",
    icon: "gear",
    blurb: "Bạn làm cho hệ thống chạy ổn. Quy trình rõ ràng, chi tiết được kiểm tra, lỗi được bắt sớm — đó là giá trị của bạn.",
    careers: ["Operations Lead", "QA Engineer", "Project Manager", "DevOps"],
  },
  Connector: {
    name: "Connector",
    tagline: "Người Kết Nối",
    color: "#3ddc84",
    icon: "network",
    blurb: "Bạn kết dính mọi người. Phối hợp, điều phối, xây mạng lưới — bạn khiến nhóm chạy nhanh hơn tổng các cá nhân.",
    careers: ["Team Lead", "Partnership Manager", "Community Builder", "Consultant"],
  },
  Communicator: {
    name: "Communicator",
    tagline: "Người Truyền Tải",
    color: "#ff2d7a",
    icon: "broadcast",
    blurb: "Bạn biến cái phức tạp thành cái rõ. Kể chuyện, thuyết phục, truyền cảm hứng — ý tưởng của bạn vang xa.",
    careers: ["Marketing Lead", "Product Manager", "Giảng viên", "Content Creator"],
  },
};

// PHASE 1 — 15 scanning questions. 3 options each, each option maps to a role.
export const CAPI_SCANNING = [
  {
    q: "Khi đối mặt với một vấn đề hoàn toàn mới, bạn thường bắt đầu bằng cách nào?",
    a: [
      { text: "Đặt câu hỏi và tìm hiểu sâu bản chất vấn đề trước", role: "Explorer" },
      { text: "Phác nhanh một mẫu thử để xem nó có chạy không", role: "Builder" },
      { text: "Rủ mọi người ngồi lại cùng bàn phương án", role: "Connector" },
    ],
  },
  {
    q: "Trong một dự án nhóm, vai trò nào bạn nhận thấy mình hay đảm nhận?",
    a: [
      { text: "Lên kế hoạch, chia việc, theo dõi tiến độ", role: "Operator" },
      { text: "Trình bày ý tưởng và bảo vệ phương án", role: "Communicator" },
      { text: "Trực tiếp làm phần kỹ thuật", role: "Builder" },
    ],
  },
  {
    q: "Điều gì khiến bạn thấy 'đã' nhất sau một ngày làm việc?",
    a: [
      { text: "Hiểu rõ được một điều mình chưa biết", role: "Explorer" },
      { text: "Có một thứ gì đó chạy được và dùng được", role: "Builder" },
      { text: "Hệ thống vận hành trơn tru cả ngày", role: "Operator" },
    ],
  },
  {
    q: "Khi có ý tưởng hay, bạn thường làm gì tiếp theo?",
    a: [
      { text: "Viết ra / kể lại để người khác cùng hiểu", role: "Communicator" },
      { text: "Tìm người có thể cùng mình hiện thực hoá nó", role: "Connector" },
      { text: "Làm thử luôn để xem nó hoạt động thế nào", role: "Builder" },
    ],
  },
  {
    q: "Một môn học lý tưởng với bạn là khi...",
    a: [
      { text: "Được tự đặt câu hỏi và đi tìm lời giải", role: "Explorer" },
      { text: "Có bài thực hành làm ra sản phẩm", role: "Builder" },
      { text: "Được thảo luận và trình bày trước lớp", role: "Communicator" },
    ],
  },
  {
    q: "Bạn để ý điều gì đầu tiên khi bước vào một nơi mới?",
    a: [
      { text: "Không khí và cách mọi người tương tác với nhau", role: "Connector" },
      { text: "Bố cục, hệ thống và cách nó vận hành", role: "Operator" },
      { text: "Những chi tiết lạ hoặc chưa được giải thích", role: "Explorer" },
    ],
  },
  {
    q: "Bạn sẽ cảm thấy 'bị bó' nhất ở kiểu công việc nào?",
    a: [
      { text: "Làm theo quy trình cố định mỗi ngày", role: "Explorer" },
      { text: "Một mình trước máy tính không nói chuyện với ai", role: "Connector" },
      { text: "Chỉ nói và viết, không được làm ra cái gì", role: "Builder" },
    ],
  },
  {
    q: "Khi cả nhóm tranh cãi không ngã ngũ, bạn sẽ...",
    a: [
      { text: "Liệt kê ưu nhược điểm từng phương án lên bảng", role: "Operator" },
      { text: "Tổng hợp các ý và đề xuất một hướng đi chung", role: "Connector" },
      { text: "Thuyết phục mọi người đi theo phương án hợp lý nhất", role: "Communicator" },
    ],
  },
  {
    q: "Chi tiết nào của một sản phẩm hấp dẫn bạn nhất?",
    a: [
      { text: "Cách nó được làm ra — cấu trúc bên trong", role: "Builder" },
      { text: "Câu chuyện và cảm xúc nó mang lại", role: "Communicator" },
      { text: "Ý tưởng ban đầu và vấn đề nó giải quyết", role: "Explorer" },
    ],
  },
  {
    q: "Khi đi du lịch cùng bạn bè, bạn hay...",
    a: [
      { text: "Lên lịch trình chi tiết và canh giờ đi", role: "Operator" },
      { text: "Kết bạn với người địa phương để nghe chuyện", role: "Connector" },
      { text: "Đi khám phá lối đi không có trên bản đồ", role: "Explorer" },
    ],
  },
  {
    q: "Bạn cảm thấy có giá trị nhất khi...",
    a: [
      { text: "Giúp người khác hiểu điều khó hiểu", role: "Communicator" },
      { text: "Làm ra một thứ vốn không tồn tại trước đó", role: "Builder" },
      { text: "Khiến một nhóm người xa lạ trở nên gắn bó", role: "Connector" },
    ],
  },
  {
    q: "Trước deadline lớn, bạn sẽ tập trung vào điều gì?",
    a: [
      { text: "Rà soát lại checklist để không sót chi tiết nào", role: "Operator" },
      { text: "Đảm bảo ai cũng hiểu vai trò của mình", role: "Connector" },
      { text: "Hoàn thiện phần sản phẩm quan trọng nhất", role: "Builder" },
    ],
  },
  {
    q: "Một bài toán khó — bạn sẽ...",
    a: [
      { text: "Đào sâu để hiểu vì sao nó lại khó", role: "Explorer" },
      { text: "Chia nhỏ thành các bước cụ thể để làm", role: "Operator" },
      { text: "Tìm người đã từng làm và học từ họ", role: "Connector" },
    ],
  },
  {
    q: "Bạn thường được bạn bè nhớ đến vì...",
    a: [
      { text: "Hay có ý tưởng lạ và câu hỏi bất ngờ", role: "Explorer" },
      { text: "Là người kể chuyện / thuyết trình cuốn", role: "Communicator" },
      { text: "Luôn tin cậy, làm xong việc đúng hạn", role: "Operator" },
    ],
  },
  {
    q: "Khi học thứ gì mới, bạn thích cách nào nhất?",
    a: [
      { text: "Đọc / xem thật nhiều nguồn rồi tổng hợp", role: "Explorer" },
      { text: "Bắt tay làm ngay, sai rồi sửa", role: "Builder" },
      { text: "Giải thích lại cho người khác để mình hiểu sâu hơn", role: "Communicator" },
    ],
  },
];

// THEMES
export const CAPI_THEMES = {
  ark: {
    id: "ark",
    name: "Chiến dịch Ark-Capi",
    subtitle: "Mật mã Hành tinh mới",
    blurb: "Năm 20xx. Trái Đất cạn tài nguyên. Bạn vận hành con tàu Ark-Capi khổng lồ để tìm 'Hành tinh Vĩnh Cửu'.",
    mood: "Kịch tính • Trách nhiệm • Giải cứu thế giới",
    accent: "#00e5ff",
    missionIds: ["m1", "m2", "m6"],
  },
  techno: {
    id: "techno",
    name: "Thực tập sinh TECHNO",
    subtitle: "Một ngày trong lĩnh vực STEAM",
    blurb: "Bạn là thực tập sinh tại tập đoàn TECHNO, trực tiếp xử lý các dự án Smart Home, Kho vận tự hành và mạng lưới Drone.",
    mood: "Chuyên nghiệp • Thực tế • Áp lực thăng tiến",
    accent: "#ff2d7a",
    missionIds: ["m3", "m4", "m5"],
  },
};

// MISSIONS — each has an intro, scenes (with chapter label + narration), and question set (3-5 Qs).
// Each answer maps to one of the 5 roles.
export const CAPI_MISSIONS = {
  m1: {
    id: "m1",
    theme: "ark",
    title: "Dòng sông Xanh",
    subtitle: "Smart Waste & Recycling",
    outfit: "eco",
    palette: ["#0a3a2a", "#3ddc84", "#00e5ff"],
    intro: {
      narration:
        "Báo động! Mức năng lượng của tàu Ark-Capi đang cực thấp. Rác nhựa bủa vây dòng sông — chúng ta phải thiết kế robot thu gom, phân loại và chuyển hoá rác thành tinh thể năng lượng sạch. Sẵn sàng chưa?",
      scene: "Dòng sông ngập rác nhựa, tàu Ark-Capi nháy đèn đỏ ở xa.",
    },
    questions: [
      {
        chapter: "Chương 1: Trinh sát",
        scene: "Capi đứng trước bờ sông, rác nhựa trôi lềnh bềnh.",
        prompt: "Rác nhựa bủa vây khắp nơi! Trước khi bắt đầu, mình nên làm gì đầu tiên?",
        a: [
          { t: "Đi dọc bờ sông xem rác tập trung ở đâu, là loại gì", role: "Explorer" },
          { t: "Nghĩ xem robot cần làm được những việc gì", role: "Builder" },
          { t: "Hỏi người dân xem tình hình rác thường ra sao", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 2: Chế tạo",
        scene: "Xưởng cơ khí, linh kiện robot trên bàn lắp ráp.",
        prompt: "Bắt tay vào làm thôi! Bước đầu tiên để biến ý tưởng thành robot thật là gì?",
        a: [
          { t: "Đặt câu hỏi để làm rõ vấn đề và nhu cầu thực tế", role: "Explorer" },
          { t: "Vẽ ngay bản phác thảo các bộ phận cơ khí của robot", role: "Builder" },
          { t: "Nói chuyện với nhóm để thống nhất mục tiêu chung", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 3: Thử thách",
        scene: "Robot bị sóng đánh mạnh, dòng nước xiết.",
        prompt: "Nước chảy xiết quá, robot sẽ bị trôi xa bệ phóng. Chúng ta nên làm gì?",
        a: [
          { t: "Khoanh vùng đoạn có dòng chảy phức tạp để hiểu nguyên nhân", role: "Explorer" },
          { t: "Điều chỉnh công suất động cơ để robot giữ vị trí", role: "Builder" },
          { t: "Điều chỉnh quy trình vận hành để giảm sai lệch", role: "Operator" },
        ],
      },
      {
        chapter: "Chương 4: Nhân rộng",
        scene: "Robot đã hoạt động ổn, nhiều khu vực khác cần triển khai.",
        prompt: "Vẫn còn khu khác cần robot. Để triển khai rộng, bạn sẽ làm gì?",
        a: [
          { t: "Tìm hiểu xem khu vực mới có gì khác biệt", role: "Explorer" },
          { t: "Chỉnh lại robot cho hợp môi trường mới", role: "Builder" },
          { t: "Trao đổi với người dân ở đó để cùng làm hiệu quả hơn", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 5: Thử thách cuối",
        scene: "Mưa bão. Robot đứng im, dòng nước cuộn mạnh.",
        prompt: "Ngay trước giờ nạp lõi, robot đột ngột dừng. Bạn phản ứng thế nào?",
        a: [
          { t: "Dừng lại để tìm nguyên nhân gốc", role: "Explorer" },
          { t: "Sửa nhanh để robot chạy lại được", role: "Builder" },
          { t: "Điều chỉnh quy trình để tránh lặp lỗi", role: "Operator" },
        ],
      },
    ],
    ending: "Lõi năng lượng phát sáng, năng lượng chạy dọc thân tàu. Hệ thống khởi động!",
  },
  m2: {
    id: "m2",
    theme: "ark",
    title: "Trạm Y tế Hạnh phúc",
    subtitle: "AI Healthcare Assistant",
    outfit: "medic",
    palette: ["#0a1040", "#ff80c8", "#00e5ff"],
    intro: {
      narration:
        "Tàu Ark-Capi cần nạp Lõi Hạnh Phúc! Bệnh viện đang quá tải, ai cũng nhăn nhó. Dùng AI để giúp bác sĩ và bệnh nhân — chỉ số Happy phải chạm 100%.",
      scene: "Sảnh bệnh viện trên tàu, bác sĩ chạy sấp mặt, cột năng lượng Happy ở 0%.",
    },
    questions: [
      {
        chapter: "Chương 1: Trinh sát",
        scene: "Bác sĩ mệt mỏi, bệnh nhân chờ, hồ sơ chất đống.",
        prompt: "Mọi người đang stress, năng lượng lõi thấp kỷ lục. Bạn làm gì đầu tiên?",
        a: [
          { t: "Quan sát xem bước nào đang tốn nhiều thời gian nhất", role: "Explorer" },
          { t: "Liệt kê yêu cầu kỹ thuật mà AI cần có", role: "Builder" },
          { t: "Hỏi y tá xem họ đang mệt ở bước nào nhất", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 2: Chế tạo",
        scene: "Lab AI, bảng dữ liệu sáng xanh, bàn đầy thiết bị.",
        prompt: "Bắt đầu chế tạo AI! Để tiến độ nhanh, bạn muốn làm phần nào?",
        a: [
          { t: "Phân tích dữ liệu bệnh án và thông tin nền", role: "Explorer" },
          { t: "Xây dựng phần cốt lõi của AI", role: "Builder" },
          { t: "Lên kế hoạch để AI chạy tốt ngoài thực tế", role: "Operator" },
        ],
      },
      {
        chapter: "Chương 2: Chế tạo",
        scene: "Bác sĩ nhíu mày trước màn hình AI khó dùng.",
        prompt: "Bác sĩ thấy hệ thống khó dùng, chỉ số Happy đứng yên. Bạn ưu tiên gì?",
        a: [
          { t: "Hỏi kỹ bác sĩ xem họ đang vướng ở đâu", role: "Explorer" },
          { t: "Thiết kế lại giao diện cho dễ nhìn, dễ bấm", role: "Builder" },
          { t: "Giải thích rõ lợi ích để bác sĩ thấy muốn dùng", role: "Communicator" },
        ],
      },
      {
        chapter: "Chương 3: Vận hành",
        scene: "AI đang chạy, bệnh nhân bắt đầu mỉm cười.",
        prompt: "Để nạp lõi nhanh hơn, ta dùng AI ở các khoang khác. Bắt đầu từ đâu?",
        a: [
          { t: "Tìm hiểu nhu cầu và cách làm việc của khoang đó", role: "Explorer" },
          { t: "Chỉnh sửa AI cho phù hợp quy trình mới", role: "Builder" },
          { t: "Trao đổi với bộ phận bên đó để phối hợp", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 4: Thử thách cuối",
        scene: "Giờ cao điểm. Màn hình AI chớp đỏ 'Quá tải'.",
        prompt: "Hệ thống đứng máy, chỉ số Happy tụt dốc! Bạn ưu tiên gì?",
        a: [
          { t: "Kiểm tra nhanh nguyên nhân quá tải", role: "Explorer" },
          { t: "Nâng cấp kỹ thuật để AI khoẻ hơn", role: "Builder" },
          { t: "Tạm thời chia lượt để AI chạy qua giờ cao điểm", role: "Operator" },
        ],
      },
    ],
    ending: "Chỉ số Happy đầy, lõi phát sáng. Hệ thống sẵn sàng cất cánh!",
  },
  m6: {
    id: "m6",
    theme: "ark",
    title: "Robot Cứu hộ",
    subtitle: "Disaster Response Robot",
    outfit: "rescue",
    palette: ["#3a0a0a", "#ff6040", "#ffb020"],
    intro: {
      narration:
        "Sự cố tại động cơ đuôi tàu — khu vực quá nóng, con người không vào được. Robot cứu hộ là hy vọng duy nhất. Countdown đã bắt đầu.",
      scene: "Áp suất vượt ngưỡng. Ánh sáng đỏ nhấp nháy. Capi đứng trước cửa khoang.",
    },
    questions: [
      {
        chapter: "Chương 1: Trinh sát",
        scene: "Hiện trường sau động đất. Dữ liệu cảm biến chạy trên màn hình.",
        prompt: "Nhóm cần chọn hướng tiếp cận đầu tiên. Bạn ưu tiên gì?",
        a: [
          { t: "Quan sát hiện trường để nắm mức độ nguy hiểm", role: "Explorer" },
          { t: "Hình dung nhiệm vụ robot có thể hỗ trợ ngay", role: "Builder" },
          { t: "Trao đổi với đội cứu hộ để hiểu tình hình", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 2: Chế tạo",
        scene: "Phòng kỹ thuật. Team họp nhanh.",
        prompt: "Trong buổi họp, bạn thường đóng vai trò nào nhất?",
        a: [
          { t: "Đặt câu hỏi then chốt để làm rõ nhu cầu", role: "Explorer" },
          { t: "Đưa ra hướng giải pháp robot/cảm biến", role: "Builder" },
          { t: "Kết nối các ý kiến thành một kế hoạch chung", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 3: Vận hành",
        scene: "Robot vào vùng nguy hiểm. Khói dày đặc.",
        prompt: "Nạn nhân hoảng sợ khi thấy robot. Bạn ưu tiên gì?",
        a: [
          { t: "Tìm hiểu cụ thể điều gì khiến họ lo lắng", role: "Explorer" },
          { t: "Điều chỉnh hình thức/âm thanh robot để giảm căng thẳng", role: "Builder" },
          { t: "Giải thích và trấn an để họ hiểu robot đang làm gì", role: "Communicator" },
        ],
      },
      {
        chapter: "Chương 4: Đối mặt thử thách",
        scene: "Robot gặp lỗi, nhiệt độ tăng mạnh.",
        prompt: "Robot đột ngột dừng giữa ca cứu hộ quan trọng. Phản ứng đầu tiên?",
        a: [
          { t: "Kết nối đơn vị khác để xin hỗ trợ dự phòng", role: "Connector" },
          { t: "Khắc phục nhanh sự cố hoặc chuyển phương án dự phòng", role: "Builder" },
          { t: "Giữ ổn định cho đội bằng cách trấn an và giải thích", role: "Communicator" },
        ],
      },
      {
        chapter: "Chương 5: Thử thách cuối",
        scene: "Countdown gần về 0. Quyết định cuối.",
        prompt: "Hệ thống quá tải khi nhiều robot chạy cùng lúc. Bạn ưu tiên gì?",
        a: [
          { t: "Phân tích dữ liệu để xác định điểm nghẽn", role: "Explorer" },
          { t: "Liên hệ đơn vị lân cận để 'chia lửa'", role: "Connector" },
          { t: "Điều chỉnh cách vận hành để giảm áp lực", role: "Operator" },
        ],
      },
    ],
    ending: "Nhiệm vụ hoàn thành. Không ai bị bỏ lại phía sau.",
  },
  m3: {
    id: "m3",
    theme: "techno",
    title: "Căn hộ Thông minh",
    subtitle: "Smart Home Automation",
    outfit: "intern",
    palette: ["#1a0a3a", "#b46cff", "#00e5ff"],
    intro: {
      narration:
        "Khu dân cư mới muốn mô hình nhà thông minh — đèn, điều hoà, camera, cảm biến phối hợp với nhau. Thách thức: phải dễ dùng, ổn định, và thực sự hữu ích hằng ngày.",
      scene: "Văn phòng TECHNO. Mentor đưa bạn tập hồ sơ khu dân cư.",
    },
    questions: [
      {
        chapter: "Chương 1: Trinh sát",
        scene: "Ngôi nhà mẫu. Gia đình đang sinh hoạt thường ngày.",
        prompt: "Bạn sẽ ưu tiên cách tiếp cận nào trước để hiểu bối cảnh?",
        a: [
          { t: "Quan sát cách mọi người sinh hoạt hằng ngày", role: "Explorer" },
          { t: "Ghi lại các việc làm thủ công để tìm phần tự động hoá", role: "Operator" },
          { t: "Hỏi trực tiếp các thành viên xem họ thấy bất tiện ở đâu", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 2: Chế tạo",
        scene: "Team họp nhanh, bảng trắng đầy ý tưởng.",
        prompt: "Trong buổi họp đầu tiên, bạn tự nhiên đóng vai trò nào?",
        a: [
          { t: "Đặt câu hỏi then chốt để cả nhóm hiểu rõ người dùng", role: "Explorer" },
          { t: "Đề xuất sớm một hướng kỹ thuật để có điểm bám", role: "Builder" },
          { t: "Kết nối các ý tưởng thành một kế hoạch chung", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 2: Chế tạo",
        scene: "Người lớn tuổi đang loay hoay với app điều khiển.",
        prompt: "Họ khó dùng app. Bạn ưu tiên xử lý theo hướng nào?",
        a: [
          { t: "Quan sát xem họ vướng ở bước nào, vì sao", role: "Explorer" },
          { t: "Thiết kế lại app đơn giản hơn — chữ to, ít nút", role: "Builder" },
          { t: "Gộp nhiều bước thành 1 nút để họ chỉ cần bấm là dùng", role: "Operator" },
        ],
      },
      {
        chapter: "Chương 3: Vận hành",
        scene: "Demo cho gia đình. Hệ thống bất ngờ lỗi.",
        prompt: "Giữa buổi demo, hệ thống gặp lỗi. Phản ứng đầu tiên?",
        a: [
          { t: "Tạm dừng kiểm tra lỗi trước khi can thiệp", role: "Operator" },
          { t: "Khắc phục nhanh phần lỗi có thể sửa ngay", role: "Builder" },
          { t: "Trấn an và giải thích ngắn gọn tình huống", role: "Communicator" },
        ],
      },
      {
        chapter: "Chương 4: Đối mặt thử thách",
        scene: "Nhiều thiết bị chạy cùng lúc. Hệ thống chậm dần.",
        prompt: "Hệ thống có dấu hiệu quá tải. Bạn ưu tiên gì?",
        a: [
          { t: "Phân tích dữ liệu để xác định nguyên nhân quá tải", role: "Explorer" },
          { t: "Tối ưu kỹ thuật để chịu tải tốt hơn", role: "Builder" },
          { t: "Điều chỉnh vận hành tạm thời để giảm áp lực", role: "Operator" },
        ],
      },
    ],
    ending: "Gia đình hài lòng. Mentor vỗ vai Capi — 'Đây là cách một dự án được nhận.'",
  },
  m4: {
    id: "m4",
    theme: "techno",
    title: "Kho vận Tự hành",
    subtitle: "Autonomous Warehouse System",
    outfit: "intern",
    palette: ["#1a1a3a", "#00e5ff", "#ffb020"],
    intro: {
      narration:
        "Trung tâm kho vận đang xử lý ngày càng nhiều đơn. Việc tìm hàng, di chuyển hàng hoá chậm dần và dễ lỗi. Nhóm bạn phát triển hệ thống kho tự hành với robot và tự động hoá.",
      scene: "Kho hàng khổng lồ, robot AGV chạy giữa các kệ, băng chuyền quay.",
    },
    questions: [
      {
        chapter: "Chương 1: Trinh sát",
        scene: "Kho hàng nhộn nhịp. Bạn đi một vòng quan sát.",
        prompt: "Để hiểu hiện trạng kho, bạn ưu tiên gì?",
        a: [
          { t: "Theo dõi một đơn hàng từ đầu đến cuối xem mất thời gian ở đâu", role: "Explorer" },
          { t: "Đo lường các chỉ số kho vận hành thực tế", role: "Operator" },
          { t: "Hỏi công nhân xem điểm đau lớn nhất là gì", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 2: Chế tạo",
        scene: "Team đang vẽ layout kho và luồng di chuyển robot.",
        prompt: "Bạn muốn nhận phần việc quan trọng nào nhất?",
        a: [
          { t: "Nghiên cứu dữ liệu để tối ưu lộ trình robot", role: "Explorer" },
          { t: "Lập trình thuật toán tránh va chạm", role: "Builder" },
          { t: "Xây quy trình phối hợp giữa robot và con người", role: "Operator" },
        ],
      },
      {
        chapter: "Chương 2: Chế tạo",
        scene: "Buổi họp. Hai phương án triển khai robot được đưa ra.",
        prompt: "Team tranh luận hai hướng triển khai. Bạn nghiêng về cách nào?",
        a: [
          { t: "So sánh rõ ưu/nhược của từng phương án", role: "Explorer" },
          { t: "Tạo phiên bản thử nhanh để kiểm chứng", role: "Builder" },
          { t: "Dẫn dắt trao đổi để cả nhóm thống nhất một lựa chọn", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 3: Vận hành",
        scene: "Robot AGV va chạm nhẹ ở giao lộ đông.",
        prompt: "Có một số điểm nghẽn giao thông robot. Bạn xử lý thế nào?",
        a: [
          { t: "Phân tích dữ liệu chuyển động để tìm điểm nghẽn", role: "Explorer" },
          { t: "Cập nhật thuật toán điều phối để tránh nghẽn", role: "Builder" },
          { t: "Điều chỉnh layout và quy trình cho robot", role: "Operator" },
        ],
      },
      {
        chapter: "Chương 4: Đối mặt thử thách",
        scene: "Công nhân lo mất việc khi robot vận hành.",
        prompt: "Công nhân e ngại robot sẽ thay thế mình. Bạn ưu tiên gì?",
        a: [
          { t: "Lắng nghe cụ thể họ đang lo lắng điều gì", role: "Explorer" },
          { t: "Thiết kế lại vai trò để con người và robot bổ trợ nhau", role: "Operator" },
          { t: "Trình bày rõ lộ trình và lợi ích chung cho cả đội", role: "Communicator" },
        ],
      },
    ],
    ending: "Kho vận hành trơn tru. Đơn hàng xử lý nhanh gấp ba. Bạn được mentor mời vào dự án lớn hơn.",
  },
  m5: {
    id: "m5",
    theme: "techno",
    title: "Mạng lưới Drone",
    subtitle: "Drone Delivery Network",
    outfit: "intern",
    palette: ["#0a2a3a", "#00e5ff", "#3ddc84"],
    intro: {
      narration:
        "Khu vực xa trung tâm đang khó nhận hàng. Nhu cầu giao thuốc và đơn khẩn ngày càng tăng. Team bạn xây Drone Delivery Network cho các điểm khó tiếp cận.",
      scene: "Sân bay drone trên nóc toà nhà. Các drone xếp hàng chờ cất cánh.",
    },
    questions: [
      {
        chapter: "Chương 1: Trinh sát",
        scene: "Bản đồ khu vực, các điểm đỏ là khu khó tiếp cận.",
        prompt: "Để hiểu bài toán, bạn ưu tiên gì trước?",
        a: [
          { t: "Phân tích bản đồ và dữ liệu giao hàng thực tế", role: "Explorer" },
          { t: "Phác thảo sơ bộ quỹ đạo bay khả thi", role: "Builder" },
          { t: "Hỏi người dân các khu xa xem họ cần gì nhất", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 2: Chế tạo",
        scene: "Drone mẫu trên bàn thử nghiệm, linh kiện quanh nó.",
        prompt: "Được giao phần việc quan trọng, bạn muốn phần nào?",
        a: [
          { t: "Nghiên cứu an toàn bay và quy định không phận", role: "Explorer" },
          { t: "Lập trình hệ thống điều hướng và tránh vật cản", role: "Builder" },
          { t: "Xây quy trình phối hợp với trung tâm điều phối", role: "Operator" },
        ],
      },
      {
        chapter: "Chương 2: Chế tạo",
        scene: "Drone mẫu đang bay thử. Gió tạt.",
        prompt: "Gió mạnh bất ngờ làm drone chệch hướng. Bạn xử lý sao?",
        a: [
          { t: "Phân tích dữ liệu thời tiết để tìm pattern", role: "Explorer" },
          { t: "Nâng cấp thuật toán bù gió cho drone", role: "Builder" },
          { t: "Bổ sung quy tắc vận hành khi gió mạnh", role: "Operator" },
        ],
      },
      {
        chapter: "Chương 3: Vận hành",
        scene: "Người dân khu xa lo lắng về tiếng ồn và quyền riêng tư.",
        prompt: "Người dân lo tiếng ồn và bị quay lén. Bạn ưu tiên gì?",
        a: [
          { t: "Tìm hiểu cụ thể điều gì khiến họ lo nhất", role: "Explorer" },
          { t: "Điều chỉnh drone — giảm ồn, giới hạn camera", role: "Builder" },
          { t: "Tổ chức buổi gặp cộng đồng để đối thoại", role: "Connector" },
        ],
      },
      {
        chapter: "Chương 4: Đối mặt thử thách",
        scene: "Cơn bão nhỏ ập đến khi 12 drone đang bay đơn khẩn.",
        prompt: "Bão bất ngờ — 12 drone đang trên không với đơn khẩn. Phản ứng đầu tiên?",
        a: [
          { t: "Phân tích nhanh vùng an toàn để hạ cánh", role: "Explorer" },
          { t: "Kích hoạt quy trình khẩn cấp đã chuẩn bị", role: "Operator" },
          { t: "Thông báo rõ tới khách hàng để họ yên tâm", role: "Communicator" },
        ],
      },
    ],
    ending: "Mạng lưới drone phủ 28 khu vực. Thuốc và đơn khẩn đến tay người cần nhanh gấp năm.",
  },
};

// Phase 3 reflection — one final question per role to confirm mapping.
export const CAPI_REFLECTION = {
  Explorer: "Khi gặp một vấn đề khó, việc ngồi lại tháo gỡ từng chút một làm bạn thấy thú vị hay khá mệt mỏi?",
  Builder: "Bạn thấy vui nhất khi được lên kế hoạch trên giấy hay khi được trực tiếp nhúng tay vào thực hiện?",
  Operator: "Làm việc theo một quy trình tỉ mỉ để kết quả hoàn hảo nhất có khiến bạn thấy an tâm và thoải mái không?",
  Connector: "Giữa việc tự làm một mình và việc kết nối mọi người để cùng làm, đâu là điều khiến bạn tự tin hơn?",
  Communicator: "Việc truyền đạt ý tưởng để thuyết phục và truyền cảm hứng cho người khác có làm bạn hào hứng không?",
};

// Helpers
export const bumpRole = (scores, role, w = 1) => ({ ...scores, [role]: (scores[role] || 0) + w });

export const topRole = (scores) => {
  let best = null, bestV = -1;
  for (const r of Object.keys(CAPI_ROLES)) {
    if ((scores[r] || 0) > bestV) { bestV = scores[r] || 0; best = r; }
  }
  return best;
};
