import { CanvaEditor, EditorConfig } from '../src/components/editor';
import React from 'react';
import { data } from './devData';
// import { data } from './sampleData';
import { useState } from 'react';
// Integrate with mock-api: make mock-up
// const editorConfig: EditorConfig = {
//   apis: {
//     url: 'http://localhost:4000/api',
//     searchFonts: '/fonts',
//     searchTemplates: '/master-templates',
//     searchTexts: '/texts',
//     searchImages: '/images',
//     searchShapes: '/shapes',
//     searchFrames: '/frames',
//     templateKeywordSuggestion: '/template-suggestion',
//     textKeywordSuggestion: '/text-suggestion',
//     imageKeywordSuggestion: '/image-suggestion',
//     shapeKeywordSuggestion: '/shape-suggestion',
//     frameKeywordSuggestion: '/frame-suggestion',
//   },
//   editorAssetsUrl: 'http://localhost:4000/editor',
//   imageKeywordSuggestions: 'animal,sport,love,scene,dog,cat,whale',
//   templateKeywordSuggestions:
//     'mother,sale,discount,fashion,model,deal,motivation,quote',
// };

// Integrate with Strapi
const editorConfig: EditorConfig = {
  // logoComponent: <Logo />,
  apis: {
    url: 'http://localhost:4000/api',
    userToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzQ5MTM5NzU3LCJleHAiOjE3NTE3MzE3NTd9.doy2N-AmnNtZ6RXdnSS4Oeco6pAf9dZvgBiFrvN7CkU',
    searchFonts: '/search-fonts',
    searchTemplates: '/search-templates',
    searchTexts: '/search-texts',
    searchImages: '/search-images',
    searchShapes: '/search-shapes',
    searchFrames: '/search-frames',
    fetchUserImages: '/your-uploads/get-user-images',
    uploadUserImage: '/your-uploads/upload',
    removeUserImage: '/your-uploads/remove',
    templateKeywordSuggestion: '/template-suggestion',
    textKeywordSuggestion: '/text-suggestion',
    imageKeywordSuggestion: '/image-suggestion',
    shapeKeywordSuggestion: '/shape-suggestion',
    frameKeywordSuggestion: '/frame-suggestion',
  },
  unsplash: {
    accessKey: 'h7hl06iEAXniAqSKnIY9UxVOjt_Bc1SRtp6T0b-T2ow',
    pageSize: 30,
  },
  editorAssetsUrl: 'http://localhost:4000/editor',
  imageKeywordSuggestions: 'animal,sport,love,scene,dog,cat,whale',
  templateKeywordSuggestions:
    'mother,sale,discount,fashion,model,deal,motivation,quote',
  translations: {
    header: {
      file: 'Tệp',
      untitledDesign: 'Thiết kế chưa đặt tên',
      createNewDesign: 'Tạo thiết kế mới',
      resize: 'Thay đổi kích thước',
      dimensionsMustBeAtLeast:
        'Kích thước phải lớn hơn 40px và nhỏ hơn 8000px.',
      allChangesSaved: 'Tất cả thay đổi đã được lưu',
      exportAllPagesAsPNG: 'Xuất tất cả trang dưới dạng PNG',
      exportAllPagesAsPDF: 'Xuất tất cả trang dưới dạng PDF',
      viewSettings: 'Cài đặt xem',
      resizePage: 'Thay đổi kích thước trang',
      import: 'Nhập',
      download: 'Tải xuống',
      preview: 'Xem trước',
      export: 'Xuất',
      help: 'Trợ giúp',
    },
    common: {
      width: 'Rộng',
      height: 'Cao',
      resize: 'Thay đổi kích thước',
      loading: 'Đang tải...',
      page: 'Trang',
      save: 'Lưu',
      addPage: 'Thêm trang',
      notes: 'Ghi chú',
      addPageTitle: 'Thêm tiêu đề trang',
      zoom: 'Zoom',
      position: 'Vị trí',
      borderWeight: 'Độ dày viền',
      cornerRounding: 'Bo tròn góc',  
      documentColors: 'Màu tài liệu',
      defaultColors: 'Màu mặc định',
      solidColors: 'Màu sắc',
      gradientColors: 'Màu gradient',
      colors: 'Màu',
      transparency: 'Độ trong suốt',
    },
    sidebar: {
      template: 'Mẫu',
      text: 'Văn bản',
      image: 'Ảnh',
      shape: 'Hình dạng',
      frame: 'Khung',
      searchTemplate: 'Tìm kiếm mẫu',
      searchText: 'Tìm kiếm text',
      searchImage: 'Tìm kiếm ảnh',
      searchShape: 'Tìm kiếm hình dạng',
      searchFrame: 'Tìm kiếm khung',
      defaultTextStyles: 'Kiểu văn bản mặc định',
      fontCombination: 'Kết hợp phông chữ',
      addAHeading: 'Thêm tiêu đề',
      addASubheading: 'Thêm tiêu đề phụ',
      addALittleBitOfBodyText: 'Thêm văn bản nhỏ',
      notesPlaceholder: 'Ghi chú sẽ được hiển thị trong View Presenter',
      imageCollection: 'Bộ sưu tập',
      yourUploads: 'Ảnh của bạn',
      upload: {
        clickToSelectOrDragAndDropImages: 'Nhấn để chọn hoặc kéo thả ảnh',
        removeImageMessage: 'Bạn có chắc chắn muốn xóa ảnh này không?',
        uploading: 'Đang tải lên...',
        failedToRemoveImage: 'Lỗi khi xóa ảnh',
        failedToFetchImages: 'Lỗi khi lấy ảnh',
        errorAddingImage: 'Lỗi khi thêm ảnh',
        errorLoadingImage: 'Lỗi khi tải ảnh',
        noImagesAvailable: 'Không có ảnh nào',
        removing: 'Đang xoá...',
      },
    },
    contextMenu: {
      lock: 'Khóa',
      unlock: 'Mở khóa',
      delete: 'Xóa',
      duplicate: 'Sao chép',
      moveUp: 'Di chuyển lên',
      moveDown: 'Di chuyển xuống',
      bringForward: 'Đưa lên trước',
      sendBackward: 'Đưa xuống sau',
      group: 'Nhóm',
      ungroup: 'Xoá phân nhóm',
      sendToBack: 'Đưa về sau',
      bringToFront: 'Đưa về trước',
      paste: 'Dán',
      setAsBackground: 'Đặt ảnh làm nền',
      detachImageFromBackground: 'Tách ảnh khỏi nền',
      layer: 'Lớp',
      showLayers: 'Hiển thị lớp',
      copy: 'Sao chép',
      cut: 'Cắt',
      undo: 'Hoàn tác',
      redo: 'Làm lại',
      selectAll: 'Chọn tất cả',
      deselect: 'Bỏ chọn',
      align: 'Căn chỉnh',
      alignLeft: 'Căn trái',
      alignCenter: 'Căn giữa',
      alignRight: 'Căn phải',
      alignTop: 'Căn trên',
      alignBottom: 'Căn dưới',
      alignMiddle: 'Căn giữa',
    },
  },
};

const Editor = () => {
  const [saving, setSaving] = useState(false);
  const name = '';
  const handleOnChanges = (changes: any) => {
    console.log('On changes: ', changes);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1e3);
  };

  const handleOnDesignNameChanges = (newName: string) => {
    console.log('On name changes: ' + newName);
    setSaving(true);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1e3);
  };
  const handleOnRemove = () => {
    console.log('remove');
  };

  return (
    <CanvaEditor
      data={{
        name,
        editorConfig: data,
      }}
      config={editorConfig}
      saving={saving}
      onRemove={handleOnRemove}
      onChanges={handleOnChanges}
      onDesignNameChanges={handleOnDesignNameChanges}
    />
  );
};

export default Editor;
