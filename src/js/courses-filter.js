(function($) {
  'use strict';

  // Filter posts by using their categories on categories page : `/categories`

  /**
   * CoursesFilter
   * @param {String} categoriesArchivesElem
   * @constructor
   */
  var CoursesFilter = function(coursesArchivesElem) {
    this.$form = $(coursesArchivesElem).find('#filter-form');
    this.$inputSearch = $(coursesArchivesElem).find('input[name=course]');
    // Element where result of the filter are displayed
    this.$archiveResult = $(coursesArchivesElem).find('.archive-result');
    this.$posts = $(coursesArchivesElem).find('.archive');
    this.$courses = $(coursesArchivesElem).find('.category-anchor');
    this.posts = coursesArchivesElem + ' .archive';
    this.courses = coursesArchivesElem + ' .course-anchor';
    // Html data attribute without `data-` of `.archive` element
    // which contains the name of category
    this.dataCourse = 'course';
    // Html data attribute without `data-` of `.archive` element
    // which contains the name of parent's categories
    this.dataParentCourses = 'parent-courses';
    this.messages = {
      zero: this.$archiveResult.data('message-zero'),
      one: this.$archiveResult.data('message-one'),
      other: this.$archiveResult.data('message-other')
    };
  };

  CategoriesFilter.prototype = {

    /**
     * Run CoursesFilter feature
     * @return {void}
     */
    run: function() {
      var self = this;

      self.$inputSearch.keyup(function() {
        self.filter(self.getSearch());
      });

      // Block submit action
      self.$form.submit(function(e) {
        e.preventDefault();
      });
    },

    /**
     * Get the search entered by user
     * @returns {String} The name of the category
     */
    getSearch: function() {
      return this.$inputSearch.val().toLowerCase();
    },

    /**
     * Show related posts form a category and hide the others
     * @param {string} category - The name of the category
     * @return {void}
     */
    filter: function(course) {
      if (course === '') {
        this.showAll();
        this.showResult(-1);
      }
      else {
        this.hideAll();
        this.showPosts(course);
        this.showResult(this.countCourses(course));
      }
    },

    /**
     * Display results of the search
     * @param {Number} numbCategories - The number of categories found
     * @return {void}
     */
    showResult: function(numbCourses) {
      if (numbCourses === -1) {
        this.$archiveResult.html('').hide();
      }
      else if (numbCourses === 0) {
        this.$archiveResult.html(this.messages.zero).show();
      }
      else if (numbCourses === 1) {
        this.$archiveResult.html(this.messages.one).show();
      }
      else {
        this.$archiveResult.html(this.messages.other.replace(/\{n\}/, numbCourses)).show();
      }
    },

    /**
     * Count number of categories
     * @param {String} category - The name of theThe date of the post category
     * @returns {Number} The number of categories found
     */
    countCourses: function(course) {
      return $(this.posts + '[data-' + this.dataCourse + '*=\'' + course + '\']').length;
    },

    /**
     * Show all posts from a category
     * @param {String} category - The name of the category
     * @return {void}
     */
    showPosts: function(course) {
      var self = this;
      var parents;
      var courses = self.courses + '[data-' + self.dataCourse + '*=\'' + course + '\']';
      var posts = self.posts + '[data-' + self.dataCourse + '*=\'' + course + '\']';

      if (self.countCourses(course) > 0) {
        // Check if selected categories have parents
        if ($(courses + '[data-' + self.dataParentCourses + ']').length) {
          // Get all categories that matches search
          $(categories).each(function() {
            // Get all its parents categories name
            parents = $(this).attr('data-' + self.dataParentCourses).split(',');
            // Show only the title of the parents's categories and hide their posts
            parents.forEach(function(parent) {
              var dataAttr = '[data-' + self.dataCourse + '=\'' + parent + '\']';
              $(self.courses + dataAttr).show();
              $(self.posts + dataAttr).show();
              $(self.posts + dataAttr + ' > .archive-posts > .archive-post').hide();
            });
          });
        }
      }
      // Show categories and related posts found
      $(courses).show();
      $(posts).show();
      $(posts + ' > .archive-posts > .archive-post').show();
    },

    /**
     * Show all categories and all posts
     * @return {void}
     */
    showAll: function() {
      this.$courses.show();
      this.$posts.show();
      $(this.posts + ' > .archive-posts > .archive-post').show();
    },

    /**
     * Hide all categories and all posts
     * @return {void}
     */
    hideAll: function() {
      this.$courses.hide();
      this.$posts.hide();
    }
  };

  $(document).ready(function() {
    if ($('#courses-archives').length) {
      var coursesFilter = new CoursesFilter('#courses-archives');
      CoursesFilter.run();
    }
  });
})(jQuery);
