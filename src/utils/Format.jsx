/* eslint-disable no-nested-ternary */
function DateFormat(date, day) {
    let hari = new Date(date).getDay();
    const tahun = date.substr(0, 4);
    let bulan = date.substr(5, 2);
    const tanggal = date.substr(8, 2);
    switch (hari) {
      case 0:
        hari = 'Minggu';
        break;
      case 1:
        hari = 'Senin';
        break;
      case 2:
        hari = 'Selasa';
        break;
      case 3:
        hari = 'Rabu';
        break;
      case 4:
        hari = 'Kamis';
        break;
      case 5:
        hari = 'Jumat';
        break;
      case 6:
        hari = 'Sabtu';
        break;
      default:
    }
    switch (bulan) {
      case '01':
        // bulan = "Jan";
        bulan = 'Januari';
        break;
      case '02':
        // bulan = "Feb";
        bulan = 'Februari';
        break;
      case '03':
        // bulan = "Mar";
        bulan = 'Maret';
        break;
      case '04':
        // bulan = "Apr";
        bulan = 'April';
        break;
      case '05':
        // bulan = "Mei";
        bulan = 'Mei';
        break;
      case '06':
        // bulan = "Jun";
        bulan = 'Juni';
        break;
      case '07':
        // bulan = "Jul";
        bulan = 'Juli';
        break;
      case '08':
        // bulan = "Agu";
        bulan = 'Agustus';
        break;
      case '09':
        // bulan = "Sep";
        bulan = 'September';
        break;
      case '10':
        // bulan = "Okt";
        bulan = 'Oktober';
        break;
      case '11':
        // bulan = "Nov";
        bulan = 'November';
        break;
      case '12':
        // bulan = "Des";
        bulan = 'Desember';
        break;
      default:
    }
    const tbt = `${tanggal} ${bulan} ${tahun}`;
    const htbt = `${hari}, ${tanggal} ${bulan} ${tahun}`;
    return day !== undefined ? htbt : tbt;
  }
  
  function TimeFormat(props) {
    const { date } = props.date;
    const jam = date.substr(11, 2);
    const menit = date.substr(14, 2);
    return `${jam}:${menit}`;
  }
  
  function Duration(props) {
    const start = new Date(props.start);
    const end = new Date(props.end);
    const seconds = Math.floor((end - start) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return `${Math.floor(interval)} Tahun`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return `${Math.floor(interval)} Bulan`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return `${Math.floor(interval)} Hari`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return `${Math.floor(interval)} Jam`;
    }
    interval = seconds / 60;
    if (interval > 1) {
      return `${Math.floor(interval)} Menit`;
    }
    return `${Math.floor(seconds)} Detik`;
  }
  
  function TimeAgo(props) {
    const start = new Date(props);
    const seconds = Math.floor((new Date() - start) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return `${Math.floor(interval)} tahun yang lalu`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return `${Math.floor(interval)} bulan yang lalu`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return `${Math.floor(interval)} hari yang lalu`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return `${Math.floor(interval)} jam yang lalu`;
    }
    interval = seconds / 60;
    if (interval > 1) {
      return `${Math.floor(interval)} menit yang lalu`;
    }
    return 'Baru saja';
  }
  
  function NpwpFormat(value) {
    value = value.replace(/[A-Za-z\W\s_]+/g, '');
    let split = 6;
    const dots = [];
  
    for (let i = 0, len = value.length; i < len; i += split) {
      split = i >= 2 && i <= 6 ? 3 : i >= 8 && i <= 12 ? 4 : 2;
      dots.push(value.substr(i, split));
    }
  
    const temp = dots.join('.');
    return temp.length > 12 ? `${temp.substr(0, 12)}-${temp.substr(12, 7)}` : temp;
  }
  
  function Gmt7(param) {
    const date = new Date(param);
    date.setHours(date.getHours() + 14);
    return date.toISOString();
  }
  
  function NumberFormat(bilangan, prefix) {
    const numberString = String(bilangan)
      .replace(/[^,\d]/g, '')
      .toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{1,3}/gi);
  
    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
  
    rupiah = split[1] !== undefined ? `${rupiah},${split[1]}` : rupiah;
    return prefix === undefined ? rupiah : prefix === 'Rp' ? `Rp${rupiah}` : `${rupiah}%`;
  }
  
  function IntegerFormat(props) {
    return props !== '' ? parseInt(props.replace(/,.*|[^0-9]/g, ''), 10) : '';
  }
  
  export { DateFormat, TimeFormat, Duration, TimeAgo, NpwpFormat, Gmt7, NumberFormat, IntegerFormat };
  